module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, text, pre, div, input)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Http



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
  , userWord : String 
  , word : String}


init : () -> (Model, Cmd Msg)
init _ =
  ( {file = Loading, userWord = "", word = "any"}
  , Http.get
      { url = "https://raw.githubusercontent.com/dolphounet/ELP_Project/main/elm/thousand_words_things_explainer.txt"
      , expect = Http.expectString GotText
      }
  )



-- UPDATE


type Msg
  = GotText (Result Http.Error String) 
  | ChangeInput String


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GotText result ->
      case result of
        Ok fullText ->
          ({model | file = Success fullText}, Cmd.none)
        Err _ ->
          ({model | file = Failure}, Cmd.none)    
    ChangeInput word -> 
      ({model | userWord = word}, Cmd.none)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none



-- VIEW


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
    
  , div [] [ if model.userWord == model.word then text "You guessed it !" else if model.userWord == "" then text "Type in your guess" else text "Try again"]
  , div [] [ input [ placeholder "Type your guess", value model.userWord, onInput ChangeInput ] [] ] 
  , div [] [ input [type_ "checkbox"] []  , text "Show the solution"] ]


