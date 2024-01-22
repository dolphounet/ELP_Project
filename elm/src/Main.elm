module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, text, pre, div, input, button)
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
  , numRandom : Int}


init : () -> (Model, Cmd Msg)
init _ =
  ( {file = Loading, textlist = [], userWord = "", word = "", numRandom = 1}
  , Http.get
      { url = "https://raw.githubusercontent.com/dolphounet/ELP_Project/main/elm/thousand_words_things_explainer.txt"
      , expect = Http.expectString GotText
      }
  )



-- UPDATE


type Msg
  = GotText (Result Http.Error String)
  | NewNumber Int  
  | ChangeInput String
  | NewWord

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
          ({file = Success fullText,  word = extract_from_list text_list model.numRandom, textlist = text_list, numRandom = model.numRandom,userWord = model.userWord }, Random.generate NewNumber (Random.int 1 (len(text_list))))
        Err _ ->
          ({model | file = Failure}, Cmd.none)    
    ChangeInput word -> 
      ({model | userWord = word}, Cmd.none)

    NewWord -> 
      ({file = model.file,  word = extract_from_list model.textlist model.numRandom, textlist = model.textlist, numRandom = model.numRandom,userWord = "" }, Random.generate NewNumber (Random.int 1 (len(model.textlist))))
      


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

    Success fullText ->
      pre [] [ text fullText ]
    ]
    
  , div [] [ if model.userWord == model.word then text "You guessed it !" else if model.userWord == "" then text "Type in your guess" else text model.word]
  , div [] [ input [ placeholder "Type your guess", value model.userWord, onInput ChangeInput ] [] ] 
  , div [] [ input [type_ "checkbox"] []  , text "Show the solution"] 
  , div [] [ button [ onClick NewWord ] [text "New Word"] ] ]


