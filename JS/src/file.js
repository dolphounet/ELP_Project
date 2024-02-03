const readline = require('readline-sync');
const { writeFile, appendFile } = require('node:fs/promises');


function file(){
// ############## FICHIERS ##################

    async function fileInit(file) {
        try {
        await writeFile(file, "");
        console.log("Fichier log prêt !");
        } catch (error) {
        console.log("Erreur lors de l'initialisation du fichier :", error.message);
        }
    }
    fileInit("../log")
    
    function log (file, data) {
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                appendFile(file, data + "\n\r")
                    .then()
                    .catch((error) => reject(error));
            });
        });
    };
  
    this.register = function (message){
        log("../log", message)
        .then(() => resolve())
        .catch((error) => console.log("Erreur lors de l'écriture de log : " + error))
    }

    this.input = function (question,check){
        answ = readline.question(question).toLowerCase();
        while (!check.includes(answ)){
        answ = readline.question(question).toLowerCase();
        }
        return answ
    }
}

module.exports = new file;
