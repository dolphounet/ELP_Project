module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, text, pre, div, input)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Http
import Json.Decode as JD exposing (Decoder, map2, field, string)
import Browser.Dom exposing (Element)


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
  | SucessDef (List Def)

type alias Model
  = { file : Status
  , userWord : String 
  , word : String}

type alias Def =
  { word : String
  , meanings : List Meaning
  }

type alias Meaning =
  { partOfSpeech : String
  , definitions : List String
  }

{--
type alias Definition =
  { definition : String
  , example : String
  }
--}
init : () -> (Model, Cmd Msg)
init _ =
  ( {file = Loading, userWord = "", word = "any"}
  , getRandomDef)

getWordList : Cmd Msg
getWordList = 
  Http.get
      { url = "https://raw.githubusercontent.com/dolphounet/ELP_Project/main/elm/thousand_words_things_explainer.txt"
      , expect = Http.expectString GotText}

-- UPDATE


type Msg
  = GotText (Result Http.Error String) 
  | ChangeInput String
  | GotDef (Result Http.Error (List Def))


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

    GotDef result ->
      case result of
        Ok def ->
          ({model | file = SucessDef def}, Cmd.none)

        Err _ ->
          ({model | file = Failure}, Cmd.none)


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


--Visuals




-- VIEW


view : Model -> Html Msg
view model =
  div [] [
  div [] [ case model.file of
    Failure ->
      text "I was unable to load your book."

    Loading ->
      text "Loading..."

    SucessDef def ->
      div [] [text "Michel"]

    Success fullText ->
      pre [] [ text fullText ]
    ]
    
    , div [] [ if model.userWord == model.word then text "You guessed it !" else if model.userWord == "" then text "Type in your guess" else text "Try again"]
    , div [] [ input [ placeholder "Type your guess", value model.userWord, onInput ChangeInput ] [] ] 
    , div [] [ input [type_ "checkbox"] []  , text "Show the solution"] ]

    

-- HTTP


getRandomDef : Cmd Msg
getRandomDef =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/hello"
    , expect = Http.expectJson GotDef wordDecoder
    }

wordDecoder : Decoder (List Def)
wordDecoder =
  JD.list defDecoder

defDecoder : Decoder Def
defDecoder =
  map2 Def
    (field "word" string)
    (field "meanings" (JD.list meaningDecoder))

meaningDecoder : Decoder Meaning
meaningDecoder =
  map2 Meaning
    (field "partOfSpeech" string)
    (field "definitions" (JD.list (field "definition" string)))
