package main

import (
	"fmt"
	"image"
	_ "image/png" // Importe le paquet image PNG pour la décodage d'images PNG
	"log"
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

	// Crée une matrice pour stocker les valeurs R, G, B de chaque pixel
	pixelMatrix := make([][][]float32, height)
	for i := range pixelMatrix {
		pixelMatrix[i] = make([][]float32, width)
		for j := range pixelMatrix[i] {
			pixelMatrix[i][j] = make([]float32, 3) // Pour stocker R, G, B
		}
	}

	// Parcours de tous les pixels de l'image et stockage des valeurs R, G, B dans la matrice
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			r, g, b, _ := img.At(x, y).RGBA()

			pixelMatrix[y][x][0] = float32(r >> 8) // Valeur du canal R
			pixelMatrix[y][x][1] = float32(g >> 8) // Valeur du canal G
			pixelMatrix[y][x][2] = float32(b >> 8) // Valeur du canal B
		}
	}

	//conversion en gray scale using 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue formula per pixel
	grayMatrix := make([][]float32, height)
	for i := range grayMatrix {
		grayMatrix[i] = make([]float32, width)
	}

	const cstred float32 = 0.299   //constante red
	const cstgreen float32 = 0.587 //constante green
	const cstblue float32 = 0.114  //constante blue

	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			grayMatrix[y][x] = cstred*pixelMatrix[y][x][0] + cstgreen*pixelMatrix[y][x][1] + cstblue*pixelMatrix[y][x][2]
			//enregistrer la valeur la plus haute

		}
	}

	// Affichage des valeurs R, G, B du premier pixel par exemple et la valeur du niveau de gris
	fmt.Printf("Valeurs R, G, B du 6ième pixel : %v\n", pixelMatrix[6][0])
	fmt.Printf("Valeur de niveau de gris du 6ième pixel : %v\n", grayMatrix[6][0])

	// Affichage de la matrice des niveaux de gris
	for y := 0; y < height; y++ {
		fmt.Printf("\n")
		for x := 0; x < width; x++ {
			fmt.Printf(" %v", grayMatrix[y][x])

		}
	}
}
