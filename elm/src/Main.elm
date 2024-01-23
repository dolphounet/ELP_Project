module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, text, pre, div, input, button, label, span, li, ul, ol)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Http
import Json.Decode as JD exposing (Decoder, map2, field, string)
import Browser.Dom exposing (Element)
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
  | SuccessDef (List Def)

type alias Model
  = { file : Status
  , textlist : List String
  , userWord : String 
  , word : String
  , numRandom : Int
  , solution : Bool
  , definition : Status
  }

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
  ( {file = Loading, textlist = [], userWord = "", word = "", numRandom = 1, solution = False,definition = Loading}
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
  | GotDef (Result Http.Error (List Def))
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
            newWord = extract_from_list text_list model.numRandom
          in
          ({model | file = Success fullText,  word = newWord, textlist = text_list},Cmd.batch[Random.generate NewNumber (Random.int 1 (len(text_list))), getRandomDef newWord])
        Err _ ->
          ({model | file = Failure}, Cmd.none)    
    ChangeInput word -> 
      ({model | userWord = word}, Cmd.none)

    GotDef result ->
      case result of
        Ok def ->
          ({model | definition = SuccessDef def}, Cmd.none)

        Err _ ->
          ({model | definition = Failure}, Cmd.none)
    NewWord -> 
      let
        newWord = extract_from_list model.textlist model.numRandom
      in
      ({model | word = newWord, userWord = "", definition = Loading}, Cmd.batch[Random.generate NewNumber (Random.int 1 (len(model.textlist))), getRandomDef newWord])

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
        label [style "font-weight" "bold", style "font-size" "3em"] [ text model.word ]
      else 
        label [style "font-weight" "bold", style "font-size" "3em"] [ text "Guess it" ]

    SuccessDef _ -> 
      text "Bug in the code"
    
  ]
  , div [] [
    case model.definition of 
      Failure -> 
        text "Could not get a definition"
      
      Loading -> 
        text "Data is loading"

      SuccessDef def ->
        ol [] (wordParsing def)

      Success _ -> 
        text "Bug in the code"
    ]

  , div [] [ if model.userWord == model.word then 
    label [style "color" "green", style "font-weight" "bold"][text "You guessed it !"]
  else if model.userWord == "" then 
    label [][text "Type in your guess" ]
  else 
    label [style "color" "red"] [ text "Try again !" ]]
  , div [] [ input [ placeholder "Type your guess", value model.userWord, onInput ChangeInput ] [] ] 
  , label [style "padding" "7.5px", style "font-size" "0.90em"] [ input [type_ "checkbox", onClick SolChange] []  , span [style "padding" "7.5px"] [text "show the solution" ]]
  , div [] [ button [ onClick NewWord ] [text "New word"] ] ]

    



getRandomDef : String -> Cmd Msg
getRandomDef word =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word
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

wordParsing : List Def -> List (Html Msg)
wordParsing defs = case defs of 
  (x :: xs) -> (li [] [ ul [] (meaningParsing x.meanings) ] :: wordParsing xs)
  [] -> []

meaningParsing : List Meaning -> List (Html Msg)
meaningParsing meanings = case meanings of 
  (x :: xs) -> (li [] [ text x.partOfSpeech, ol [] (definitionParsing x.definitions) ] :: meaningParsing xs)
  [] -> []

definitionParsing  : List String -> List (Html Msg)
definitionParsing definitions = case definitions of 
  (x :: xs) -> (li [] [text x]  :: definitionParsing xs)
  [] -> []
