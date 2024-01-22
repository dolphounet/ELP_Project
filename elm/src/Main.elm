module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, text, pre, div, input, button, label)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Http
import Random




-- MAIN


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }



-- MODEL

type Status 
  = Failure
  | Loading
  | Success String

type alias Model
  = { file : Status
  , textlist : List String
  , userWord : String 
  , word : String
  , numRandom : Int
  , solution : Bool}


init : () -> (Model, Cmd Msg)
init _ =
  ( {file = Loading, textlist = [], userWord = "", word = "", numRandom = 1, solution = False}
  ,Cmd.batch [Http.get
      { url = "https://raw.githubusercontent.com/dolphounet/ELP_Project/main/elm/thousand_words_things_explainer.txt"
      , expect = Http.expectString GotText
      }, Random.generate NewNumber (Random.int 1 1000)]
  )



-- UPDATE


type Msg
  = GotText (Result Http.Error String)
  | NewNumber Int  
  | ChangeInput String
  | NewWord
  | SolChange

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    NewNumber newnumber ->
      ({model | numRandom = newnumber}, Cmd.none)
    GotText result ->
      case result of
        Ok fullText ->
          let 
            text_list = String.split " " fullText
          in
          ({model | file = Success fullText,  word = extract_from_list text_list model.numRandom, textlist = text_list}, Random.generate NewNumber (Random.int 1 (len(text_list))))
        Err _ ->
          ({model | file = Failure}, Cmd.none)    
    ChangeInput word -> 
      ({model | userWord = word}, Cmd.none)

    NewWord -> 
      ({model | word = extract_from_list model.textlist model.numRandom, userWord = "" }, Random.generate NewNumber (Random.int 1 (len(model.textlist))))

    SolChange -> 
      ({model | solution = not model.solution}, Cmd.none)
      


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW
len lst = case lst of
   [] -> 0
   (x :: xs) -> 1 + len xs

extract_from_list : List String -> Int -> String
extract_from_list lst indice = case indice of
  0 -> case lst of 
    [] -> ""
    [x] -> x
    (x :: xs) -> x
  a -> case lst of 
    [] -> ""
    [x] -> x
    (x :: xs) -> extract_from_list xs (a-1)

view : Model -> Html Msg
view model =
  div [] [
  div [] [ case model.file of
    Failure ->
      text "I was unable to load your book."

    Loading ->
      text "Loading..."

    Success _ ->
      if model.solution then 
        label [] [ text model.word ]
      else 
        label [] [ text "Guess it" ]
    ]
    
  , div [] [ if model.userWord == model.word then 
    text "You guessed it !" 
  else if model.userWord == "" then 
    text "Type in your guess" 
  else text "Try again !" ]
  , div [] [ input [ placeholder "Type your guess", value model.userWord, onInput ChangeInput ] [] ] 
  , label [] [ input [type_ "checkbox", onClick SolChange] []  , text "Show the solution"] 
  , div [] [ button [ onClick NewWord ] [text "New word"] ] ]


