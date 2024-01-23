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
	"time"
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

func convolveParal(img [][]float64, imgRes [][]float64, kernel [][]float64, width_deb, width_fin int, wg *sync.WaitGroup, main int) {

	height := len(imgRes)
	width := len(imgRes[0])

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
	if main == 0 {
		defer wg.Done()
	}
}

func sobel(img [][]float64, result [][]float64, width_deb, width_fin int, maxChan []float64) {
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
		go convolveParal(img, sumX, x_sobel, width_deb+int(float64(width_fin-width_deb)*(i/2)), width_deb+int(float64(width_fin-width_deb)*((i+1)/2)), &wg_sobel, 0)
		go convolveParal(img, sumY, y_sobel, width_deb+int(float64(width_fin-width_deb)*(i/2)), width_deb+int(float64(width_fin-width_deb)*((i+1)/2)), &wg_sobel, 0)
	}
	wg_sobel.Wait()

	max_value := float64(0)
	for y := 0; y < height; y++ {
		for x := width_deb; x < width_fin-1; x++ {
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
}

func contouring(matrix [][]float64, result [][]float64, lowerThreshold, highThreshold, max_value, tolerance float64, width_deb, width_fin int, wg *sync.WaitGroup) {
	// Initialisation des constantes
	height := len(matrix)

	// Parcours de l'image pixel par pixel et comparaison avec les threshold
	for i := 1; i < height-1; i++ {
		for j := width_deb; j < width_fin+1; j++ {

			// comparaison avec les thresholds + suppression non max
			if matrix[i][j] < lowerThreshold || matrix[i][j] < (max_value*(1-tolerance)) {
				result[i][j] = 0

			} else if matrix[i][j] > highThreshold {
				result[i][j] = 255

			} else {
				// Cas ou on est entre les threshold, on vérifie la présence de pixels forts voisins
				for k := -1; k <= 1; k++ {
					for l := -1; l <= 1; l++ {
						if matrix[i+k][j+l] > highThreshold {
							result[i][j] = 255
						}
					}
				}
				if matrix[i][j] != 255 {
					result[i][j] = 0
				}
			}
		}
	}
	defer wg.Done()
}

func read_img(imageFournie string) image.Image {
	// Ouvrir le fichier image
	imageFile, err := os.Open(imageFournie)

	if err != nil {
		log.Fatal(err)
	}
	defer imageFile.Close() //On attends qu'open finisse de s'exécuter avant de close

	// Décode l'image
	img, _, err := image.Decode(imageFile)
	if err != nil {
		log.Fatal(err)
	}

	return img
}

func write_img(img string, matrix [][]float64) {

	grayImage := image.NewGray(image.Rect(0, 0, len(matrix[0]), len(matrix)))

	// Parcours de la matrice et assignation des niveaux de gris à l'image
	for y := 0; y < len(matrix); y++ {
		for x := 0; x < len(matrix[0]); x++ {
			grayValue := matrix[y][x]
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

func rgb_to_grayscale_paral(img image.Image, grayMatrix [][]float64, height, width_deb, width_fin int) {
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
}

func worker(img image.Image, grayMatrix, imgGauss, imgGrad, kernel [][]float64, max_valueChan []float64, height, width int, i, threads float64, keypointer *sync.WaitGroup) {

	rgb_to_grayscale_paral(img, grayMatrix, int(float64(height)), int(float64(width)*(i/threads)), int(float64(width)*((i+1)/threads)))
	convolveParal(grayMatrix, imgGauss, kernel, int(float64(width)*(i/threads)), int(float64(width)*((i+1)/threads)), keypointer, 1)
	if int(i)%4 == 0 {
		sobel(imgGauss, imgGrad, int(float64(width)*((i/4)/(threads/4))), int(float64(width)*(((i/4)+1)/(threads/4))), max_valueChan)
	}
}

func main() {
	start := time.Now()

	// Gestion d'images
	img := read_img("input/wall_anime_8K.png")

	bounds := img.Bounds()
	width, height := bounds.Max.X, bounds.Max.Y

	const cstred float64 = 0.299   //constante red pour la norme grayscale
	const cstgreen float64 = 0.587 //constante green pour la norme grayscale
	const cstblue float64 = 0.114  //constante blue pour la norme grayscale

	// Paramètres de fonctions
	kernelSize := 5
	sigma := 1.4
	tolerance := 0.8
	minThreshold := 0.1
	maxThreshold := 0.4

	// Elements fixes de fonctions
	kernel := generateGaussianFilter(kernelSize, sigma)
	max_valueChan := []float64{-1, -1}

	// Matrices d'écriture
	grayMatrix := make([][]float64, height)
	imgGauss := make([][]float64, height)
	imgRes := make([][]float64, height+2)
	imgGrad := make([][]float64, height+2)

	// Initalisation des matrices
	for i := 0; i < height; i++ {
		grayMatrix[i] = make([]float64, width)
		imgGauss[i] = make([]float64, width)
	}
	for j := 0; j < height+2; j++ {
		imgGrad[j] = make([]float64, width+2)
		imgRes[j] = make([]float64, width+2)
	}
	// Variables de threads
	threads := float64(4)
	var wg sync.WaitGroup

	// Use of worker
	for k := float64(0); k < threads; k++ {
		wg.Add(1)
		k := k
		go func() {
			defer wg.Done()
			worker(img, grayMatrix, imgGauss, imgGrad, kernel, max_valueChan, height, width, k, threads, &wg)
		}()

	}
	// Need to wait for full image
	wg.Wait()

	// Recupération de la valeur maximale
	max_value := max_valueChan[0]
	for _, value := range max_valueChan {
		if value > max_value {
			max_value = value
		}
	}

	for i := float64(0); i < threads; i++ {
		wg.Add(1)
		go contouring(imgGrad, imgRes, minThreshold, maxThreshold, max_value, tolerance, int(float64(width)*(i/threads)), int(float64(width)*((i+1)/threads)), &wg)
	}
	wg.Wait()

	//Image writing
	write_img("output/output.png", imgRes)

	// See time
	elapsed := time.Since(start)
	fmt.Printf("c'est bon : %s\n", elapsed)
}
