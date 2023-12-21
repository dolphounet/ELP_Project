# ELP_Project
Membres :
1. Maxence Poisse-Joubert
2. Hélio Vatan
3. Gaspar Lévêque

# Objective
Our objective is to make a Canny filter by following these steps :

1. Read the image
2. Apply grayscale using the : 0.299 ∙ Red + 0.587 ∙ Green + 0.114 ∙ Blue formula per pixel.
3. Apply gaussian filter on the image
4. Calculate the gradiant matrix of the image
5. Suppressing the non maximum values
6. Apply a countouring filter via a threshold
   ( Pixels under the lower threshold does not pass the filter
   - Pixels over the high threshold pass the filter 
   - Pixels in-between pass only if they are adjascent to already passed pixels )

# Libraries


