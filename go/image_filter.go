package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"math"
	"os"
	"sync"
)

func generateGaussianFilter(size int, sigma float64) [][]float64 {
	filter := make([][]float64, size)
	center := size / 2
	sum := float64(0)

	for i := 0; i < size; i++ {
		filter[i] = make([]float64, size)
		for j := 0; j < size; j++ {
			x := float64(i - center)
			y := float64(j - center)
			filter[i][j] = float64(math.Exp(float64(-(x*x+y*y)/(2*sigma*sigma)))) / (2 * float64(math.Pi) * sigma * sigma)
			sum += filter[i][j]
		}
	}

	// Normalize the filter
	for i := 0; i < size; i++ {
		for j := 0; j < size; j++ {
			filter[i][j] /= sum
		}
	}

	return filter
}

func convolveParal(img [][]float64, imgRes [][]float64, kernel [][]float64, width_deb, width_fin int, wg *sync.WaitGroup) {
	height := len(img)
	width := len(img[0])
	for y := 0; y < height; y++ {
		for x := width_deb; x < width_fin; x++ {
			sum := float64(0)
			for i := 0; i < len(kernel); i++ {
				for j := 0; j < len(kernel); j++ {
					if x+i-len(kernel)/2 >= 0 && y+j-len(kernel)/2 >= 0 && x+i-len(kernel)/2 < width && y+j-len(kernel)/2 < height {
						sum += img[y+j-len(kernel)/2][x+i-len(kernel)/2] * kernel[i][j]
					}
				}
			}
			imgRes[y][x] = sum
		}
	}
	defer wg.Done()
}

func convolve(img [][]float64, kernel [][]float64) [][]float64 {
	width := len(img[0])
	height := len(img)
	result := make([][]float64, height)
	for y := 0; y < height; y++ {
		result[y] = make([]float64, width)
		for x := 0; x < width; x++ {
			sum := float64(0)
			for i := 0; i < len(kernel); i++ {
				for j := 0; j < len(kernel); j++ {
					if x+i-len(kernel)/2 >= 0 && y+j-len(kernel)/2 >= 0 && x+i-len(kernel)/2 < width && y+j-len(kernel)/2 < height {
						sum += img[y+j-len(kernel)/2][x+i-len(kernel)/2] * kernel[i][j]
					}
				}
			}
			result[y][x] = sum
		}
	}
	return result
}

func sobel(img [][]float64, result [][]float64, width_deb, width_fin int, maxChan []float64, wg *sync.WaitGroup) {
	var wg_sobel sync.WaitGroup
	x_sobel := [][]float64{
		{1, 0, -1},
		{2, 0, -2},
		{1, 0, -1},
	}
	y_sobel := [][]float64{
		{1, 2, 1},
		{0, 0, 0},
		{-1, -2, -1},
	}
	width := len(img[0])
	height := len(img)

	sumX := make([][]float64, height)
	sumY := make([][]float64, height)
	for i := 0; i < height; i++ {
		sumX[i] = make([]float64, width)
		sumY[i] = make([]float64, width)
	}
	for i := float64(0); i < 2; i++ {
		wg_sobel.Add(2)
		go convolveParal(img, sumX, x_sobel, width_deb+int(float64(width_fin-width_deb)*(i/2)), width_deb+int(float64(width_fin-width_deb)*((i+1)/2)), &wg_sobel)
		go convolveParal(img, sumY, y_sobel, width_deb+int(float64(width_fin-width_deb)*(i/2)), width_deb+int(float64(width_fin-width_deb)*((i+1)/2)), &wg_sobel)
	}
	wg_sobel.Wait()
	max_value := float64(0)
	for y := 0; y < height; y++ {
		for x := width_deb; x < width_fin; x++ {
			valX := sumX[y][x]
			valY := sumY[y][x]
			gradiant := float64(math.Sqrt(valX*valX + valY*valY))
			if gradiant > max_value {
				max_value = gradiant
			}
			result[y][x] = gradiant
		}
	}
	for i := 0; i < len(maxChan); i++ {
		if maxChan[i] == -1 {
			maxChan[i] = max_value
		}
	}
	defer wg.Done()
}

func normalize(result [][]float64, max_value float64) {

	for y := 0; y < len(result); y++ {
		for x := 0; x < len(result[0]); x++ {
			result[y][x] = result[y][x] / max_value
		}
	}
}
func suppressNonMax(matrix [][]float64, tolerance float64) {
	// Initialisation des valeurs
	width := len(matrix[0])
	height := len(matrix)

	// Vérification du rapport des pixels au max (1 car 100%) et la tolérance
	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			if matrix[i][j] < (1 - tolerance) {
				matrix[i][j] = 0
			}
		}
	}
}

func contouring(matrix [][]float64, lowerThreshold float64, highThreshold float64) {
	// Initialisation des constantes
	width := len(matrix[0])
	height := len(matrix)

	// Parcours de l'image pixel par pixel et comparaison avec les threshold
	for i := 1; i < height-1; i++ {
		for j := 1; j < width-1; j++ {

			if matrix[i][j] < lowerThreshold {
				matrix[i][j] = 0

			} else if matrix[i][j] > highThreshold {
				matrix[i][j] = 255

			} else {
				// Cas ou on est entre les threshold, on vérifie la présence de pixels forts voisins
				for k := -1; k <= 1; k++ {
					for l := -1; l <= 1; l++ {
						if matrix[i+k][j+l] > highThreshold {
							matrix[i][j] = 255
						}
					}
				}
				if matrix[i][j] != 255 {
					matrix[i][j] = 0
				}
			}
		}
	}
}

func resize(matrix [][]float64) [][]float64 {
	// Initialisation des valeurs nécessaires
	width := len(matrix[0])
	height := len(matrix)

	line := make([]float64, width+2)

	// Ajout des contours à la matrice
	for i := 0; i < height; i++ {
		matrix[i] = append(matrix[i], 0)
		matrix[i] = append([]float64{0}, matrix[i]...)
	}
	matrix = append(matrix, [][]float64{line}...)
	matrix = append([][]float64{line}, matrix...)

	return matrix
}

func read_img(imageFournie string) image.Image {
	// Ouvrir le fichier image
	imageFile, err := os.Open(imageFournie)

	if err != nil {
		log.Fatal(err)
	}
	defer imageFile.Close() //defer signifie qu'on retarde imageFile.Close jusqu'à ce que la fonction main soit terminée

	// Décode l'image
	img, _, err := image.Decode(imageFile)
	if err != nil {
		log.Fatal(err)
	}

	return img
}

func write_img(img string, grayMatrix [][]float64) {

	grayImage := image.NewGray(image.Rect(0, 0, len(grayMatrix[0]), len(grayMatrix)))

	// Parcours de la matrice et assignation des niveaux de gris à l'image
	for y := 0; y < len(grayMatrix); y++ {
		for x := 0; x < len(grayMatrix[0]); x++ {
			grayValue := grayMatrix[y][x]
			var grayValue2 uint8 = uint8(math.Round(float64(grayValue)))
			grayImage.SetGray(x, y, color.Gray{Y: grayValue2})
		}
	}

	// Création d'un fichier image PNG

	file, err := os.Create(img)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Encodage de l'image en format PNG et écriture dans le fichier
	if err := png.Encode(file, grayImage); err != nil {
		log.Fatal(err)
	}
}

func rgb_to_grayscale_paral(img image.Image, grayMatrix [][]float64, height, width_deb, width_fin int, wg *sync.WaitGroup) {
	//conversion en gray scale using 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue formula per pixel

	const cstred float64 = 0.299   //constante red
	const cstgreen float64 = 0.587 //constante green
	const cstblue float64 = 0.114  //constante blue

	// Parcours de tous les pixels de l'image et stockage des valeurs R, G, B dans la matrice
	for y := 0; y < height; y++ {
		for x := width_deb; x < width_fin; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			grayMatrix[y][x] = cstred*float64(r>>8) + cstgreen*float64(g>>8) + cstblue*float64(b>>8)

		}
	}
	defer wg.Done()
}
func rgb_to_grayscale(img image.Image) [][]float64 {
	bounds := img.Bounds()
	width, height := bounds.Max.X, bounds.Max.Y

	//conversion en gray scale using 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue formula per pixel
	grayMatrix := make([][]float64, height)
	for i := range grayMatrix {
		grayMatrix[i] = make([]float64, width)
	}

	const cstred float64 = 0.299   //constante red
	const cstgreen float64 = 0.587 //constante green
	const cstblue float64 = 0.114  //constante blue

	// Parcours de tous les pixels de l'image et stockage des valeurs R, G, B dans la matrice
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			grayMatrix[y][x] = cstred*float64(r>>8) + cstgreen*float64(g>>8) + cstblue*float64(b>>8)

		}
	}

	return grayMatrix
}

func main() {
	img := read_img("C:/testsGO/wall_anime_8K.png")

	bounds := img.Bounds()
	width, height := bounds.Max.X, bounds.Max.Y
	grayMatrix := make([][]float64, height)
	for i := range grayMatrix {
		grayMatrix[i] = make([]float64, width)
	}

	const cstred float64 = 0.299   //constante red
	const cstgreen float64 = 0.587 //constante green
	const cstblue float64 = 0.114  //constante blue

	var wg sync.WaitGroup
	for i := float64(0); i < 8; i++ {
		wg.Add(1)
		go rgb_to_grayscale_paral(img, grayMatrix, int(float64(height)), int(float64(width)*(i/8)), int(float64(width)*((i+1)/8)), &wg)
	}
	wg.Wait()
	write_img("C:/testsGO/grayed.png", grayMatrix)

	kernel := generateGaussianFilter(5, 1.4)

	imgGauss := make([][]float64, height)
	for i := 0; i < height; i++ {
		imgGauss[i] = make([]float64, width)
	}

	for i := float64(0); i < 8; i++ {
		wg.Add(1)
		go convolveParal(grayMatrix, imgGauss, kernel, int(float64(width)*(i/8)), int(float64(width)*((i+1)/8)), &wg)
	}
	wg.Wait()
	max_valueChan := []float64{-1, -1}

	imgGrad := make([][]float64, height)
	for i := 0; i < height; i++ {
		imgGrad[i] = make([]float64, width)
	}
	for i := float64(0); i < 2; i++ {
		wg.Add(1)
		go sobel(imgGauss, imgGrad, int(float64(width)*(i/2)), int(float64(width)*((i+1)/2)), max_valueChan, &wg)
	}
	wg.Wait()
	write_img("C:/testsGO/gaussed.png", imgGauss)
	max_value := max_valueChan[0]
	for _, value := range max_valueChan {
		if value > max_value {
			max_value = value
		}
	}
	normalize(imgGrad, max_value)
	write_img("C:/testsGO/sobled.png", imgGrad)
	resize(imgGrad)
	suppressNonMax(imgGrad, 0.75)

	write_img("C:/testsGO/nonmax.png", imgGrad)
	contouring(imgGrad, 0.1, 0.3)

	write_img("C:/testsGO/michel.png", imgGrad)
	fmt.Println("c'est bon")
}
