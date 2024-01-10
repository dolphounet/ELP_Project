package main

import (
	"math"
)

func generateGaussianFilter(size int, sigma float64) [][]float64 {
	filter := make([][]float64, size)
	center := size/2
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

func main()  {
  filter := generateGaussianFilter(5, float64(2))

}
