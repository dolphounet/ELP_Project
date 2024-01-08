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

func main() {
	// Ouvrir le fichier image
	imageFile, err := os.Open("C:/testsGO/oeuvre.png")
	if err != nil {
		log.Fatal(err)
	}
	defer imageFile.Close() //defer signifie qu'on retarde imageFile.Close jusqu'à ce que la fonction main soit terminée

	// Décode l'image
	img, _, err := image.Decode(imageFile)
	if err != nil {
		log.Fatal(err)
	}

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

	// Affichage des valeurs R, G, B du premier pixel par exemple et la valeur du niveau de gris
	fmt.Printf("Valeur de niveau de gris du 6ième pixel : %v\n", grayMatrix[6][0])

	// Affichage de la matrice des niveaux de gris
	for y := 0; y < height; y++ {
		fmt.Printf("\n")
		for x := 0; x < width; x++ {
			fmt.Printf(" %v", grayMatrix[y][x])

		}
	}

	//création d'une nouvelle image png en niveaux de gris
	grayImage := image.NewGray(image.Rect(0, 0, width, height))

	// Parcours de la matrice et assignation des niveaux de gris à l'image
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			grayValue := grayMatrix[y][x]
			var grayValue2 uint8 = uint8(math.Round(float64(grayValue)))
			grayImage.SetGray(x, y, color.Gray{Y: grayValue2})
		}
	}

	// Création d'un fichier image PNG
	file, err := os.Create("nouvelle_image.png")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Encodage de l'image en format PNG et écriture dans le fichier
	if err := png.Encode(file, grayImage); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Fichier PNG créé avec succès.")
}
