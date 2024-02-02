const readline = require('readline-sync');
const { writeFile, appendFile } = require('node:fs/promises');


function file(){
// ############## FICHIERS ##################

    async function fileInit(file) {
        try {
        await writeFile(file, "");
        console.log("c'est bongue");
        } catch (error) {
        console.log("Erreur lors de l'initialisation du fichier :", error.message);
        }
    }
    fileInit("log")
    
    async function log(file, data) {
        try {
        await appendFile(file, data + "\n\r");
        } catch (error) {
        console.log("Erreur lors de l'écriture de log :", error.message);
        }
    }

    this.input = function(question,check){
        answ = readline.question(question).toLowerCase();
        while (!check.includes(answ)){
          answ = readline.question(question).toLowerCase();
        }
        return answ
    }
}

module.exports = file;