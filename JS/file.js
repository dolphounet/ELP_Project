const readline = require('readline-sync');
const { writeFile, appendFile } = require('node:fs/promises');


function file(){
// ############## FICHIERS ##################

    async function fileInit(file) {
        try {
        await writeFile(file, "");
        console.log("Fichier prêt !");
        } catch (error) {
        console.log("Erreur lors de l'initialisation du fichier :", error.message);
        }
    }
    fileInit("log")
    
    this.log = function (file, data) {
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                appendFile(file, data + "\n\r")
                    .then()
                    .catch((error) => reject(error));
            });
        });
    };
  
    this.input = function (question,check){
    answ = readline.question(question).toLowerCase();
    while (!check.includes(answ)){
      answ = readline.question(question).toLowerCase();
    }
    return answ
    }
}

module.exports = new file;
