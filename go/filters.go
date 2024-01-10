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

func convolve(img [][]float64, kernel [][]float64) [][]float64{
	width := len(img[0])
	height := len(img)
  result := make([][]float64, height)
  for y := 0; y<height; y++{
    result[y] = make([]float64, width)
    for x := 0; x<width; x++{
      sum := float64(0)
      for i := 0; i<len(kernel); i++{
        for j := 0; j<len(kernel); j++{
          if x + i - len(kernel)/2 >= 0 && y + j - len(kernel)/2 >= 0 && x+i -len(kernel)/2 < width && y+j-len(kernel)/2<height{
            sum += img[y+j-len(kernel)/2][x+i-len(kernel)/2]*kernel[i][j]
          }
        }
      }
      result[y][x] = sum
    }
  }
  return result
}

func main()  {
  //filter := generateGaussianFilter(5, float64(2))
}
