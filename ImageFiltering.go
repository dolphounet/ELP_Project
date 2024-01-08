package filtering

func filtering() {

}

func suppressNonMax(matrix [][]float64, height int, width int, max float64) {
	const tolerance float64 = 0.0

	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			if matrix[i][j] < max-tolerance {
				matrix[i][j] = 0
			}
		}
	}
}

func contouring(matrix [][]float64, height int, width int) {

	const lowerThreshold float64 = 0.1
	const highThreshold float64 = 0.3

	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			if matrix[i][j] < 0.1 {
				matrix[i][j] = 0

			}
			if matrix[i][j] > 0.3 {
				matrix[i][j] = 255

			}
		}
	}
}

func resize(matrix [][]float64, height int, width int) {
	line := make([]float64, width)
	for k := 0; k < width; k++ {
		line = append(line, 0)
	}
	for i := 0; i < height; i++ {
		matrix[i] = append(matrix[i], 0)
		matrix[i] = append([]float64{0}, matrix[i]...)
	}
	matrix = append(matrix, [][]float64{line}...)
	matrix = append([][]float64{line}, matrix...)
}
