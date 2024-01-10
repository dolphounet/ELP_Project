package main

import "fmt"

func main() {
	a := [][]float64{
		{5, 1, 5, 3},
		{4, 5, 7, 7},
	}
	a = resize(a, 2, 4)
	suppressNonMax(a, 4, 6, 7)
	contouring(a, 4, 6)
	for i := range a {
		fmt.Println(a[i])
	}

}

func suppressNonMax(matrix [][]float64, height int, width int, max float64) {
	const tolerance float64 = 3

	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			if matrix[i][j] < (max - tolerance) {
				matrix[i][j] = 0
			}
		}
	}
}

func contouring(matrix [][]float64, height int, width int) {

	const lowerThreshold float64 = 4
	const highThreshold float64 = 6

	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			if matrix[i][j] < lowerThreshold {
				matrix[i][j] = 0
			} else if matrix[i][j] > highThreshold {
				matrix[i][j] = 255
			} else {
				for k := -1; k <= 1; k++ {
					for l := -1; l <= 1; l++ {
						if matrix[i+k][j+l] > highThreshold {
							matrix[i][j] = 255
							matrix[i+k][j+l] = 255
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

func resize(matrix [][]float64, height int, width int) [][]float64 {
	line := make([]float64, width+2)

	for i := 0; i < height; i++ {
		matrix[i] = append(matrix[i], 0)
		matrix[i] = append([]float64{0}, matrix[i]...)
	}
	matrix = append(matrix, [][]float64{line}...)
	matrix = append([][]float64{line}, matrix...)

	return matrix
}
