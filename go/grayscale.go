package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	_ "image/png" // Importe le paquet image PNG pour la décodage d'images PNG
	"log"
	"math"
	"os"
)

// on peut renvoyer des fichiers png et jpeg mais seulement ouvrir et décoder du png
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

func write_img(img string, grayMatrix [][]float64)  {

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

func rgb_to_grayscale(img image.Image) [][]float64 {

  // Récupère la taille de l'image
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

	//à modifier pour importer l'image choisie !!

	const imagefournie string = "/home/maxence/Documents/arch-black-4k"
	var format string = ".png"
  img := read_img(imagefournie + format)
  grayMatrix := rgb_to_grayscale(img)
	write_img("/home/maxence/Documents/ELP_Project/go/imageGrisee.png", grayMatrix)
	// Affichage des valeurs R, G, B du premier pixel par exemple et la valeur du niveau de gris

	// Affichage de la matrice des niveaux de gris
	/*for y := 0; y < height; y++ {
		fmt.Printf("\n")
		for x := 0; x < width; x++ {
			fmt.Printf(" %v", grayMatrix[y][x])

		}
	}
	*/

	//création d'une nouvelle image png en niveaux de gris
	

	fmt.Printf("Fichier %s créé avec succès.", format)
}
