function visuels(){
    // ########### VISUELS ###########

    function normaliseStr(string,length,separ){
        add = length-string.length
        for (let i=0;i<add;i++){
        string += " "
        }
        return string + separ
    }
  
    this.Affichage = function(grilles,carpets,player,jarnac){

        // Init
        let maxlenght = 28;
        let begin = "   ║    "
        let ext = "║   "
        let separ = "     ║     ";
        let valid = [1,1];
        let strCarpetsBuild = [[],[]];
        let strGrilles = "";
        let strCarpets = "";

        // CREATION UNE LIGNE
        // strCarpet[i] += "  " + String.fromCharCode(carpets[i][j] + 65);
        // normaliseStr(begin + strCarpet[0],maxlenght,separ)+normaliseStr(strCarpet[1],maxlenght-2,ext)

        for (let i=0;i<2;i++){
            // Init
            let sixaines = Math.floor(carpets[i].length/6);

            for(let j=0;j<sixaines;j++){
            str = ""
            for(let k=j*6;k<j*6+6;k++){
                str += "  " + String.fromCharCode(carpets[i][k] + 65);
            }
            strCarpetsBuild[i].push(str)
            }
            str = ""
            for(let l=sixaines*6;l<carpets[i].length;l++){str += "  " + String.fromCharCode(carpets[i][l] + 65);}
            strCarpetsBuild[i].push(str)
        }


        for (let j=0;j<Math.max(strCarpetsBuild[0].length,strCarpetsBuild[1].length);j++){
            strA = strCarpetsBuild[0][j]
            strB = strCarpetsBuild[1][j]
            if (strA === undefined){strA =""}
            if (strB === undefined){strB =""}
            if (j==Math.max(strCarpetsBuild[0].length,strCarpetsBuild[1].length)-1){strCarpets += normaliseStr(begin + strA,maxlenght,separ)+normaliseStr(strB,maxlenght-2,ext)}
            else {strCarpets += normaliseStr(begin + strA,maxlenght,separ)+normaliseStr(strB,maxlenght-2,ext) + "\n"}
        }

        for (let j=0;j<8;j++){
            if (grilles[0][j]!=""){valid[0] ++;}
            if (grilles[1][j]!=""){valid[1] ++;}
            if (j!= 7){strGrilles +=  normaliseStr(begin + "   " + String(j+1) + ". : " + grilles[0][j],maxlenght,separ) + normaliseStr("   " + String(j+1) + ". : " + grilles[1][j],maxlenght-2,ext) + "\n"}
            else {strGrilles +=  normaliseStr(begin + "   " + String(j+1) + ". : " + grilles[0][j],maxlenght,separ) + normaliseStr("   " + String(j+1) + ". : " + grilles[1][j],maxlenght-2,ext)}
        }
        console.log("\n   ╔═════════════════════════════════════════════════════════════╗")
        console.log("   ║                      Tour du joueur "+String(player+1)+"                       ║")
        console.log("   ╠═════════════════════════════╦═══════════════════════════════╣")
        console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
        console.log(normaliseStr(begin + "Grille du joueur : 1",maxlenght,separ)+normaliseStr("Grille du joueur : 2",maxlenght-2,ext))
        console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
        console.log(strGrilles)
        console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
        console.log("   ╠═════════════════════════════╬═══════════════════════════════╣")
        console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
        console.log(normaliseStr(begin + " Tapis du Joueur : 1",maxlenght,separ)+normaliseStr(" Tapis du Joueur : 2",maxlenght-2,ext))
        console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
        console.log(strCarpets);
        console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
        console.log("   ╠═════════════════════════════╩═══════════════════════════════╣")
        console.log("   ║                   Jarnac Possibles : " +String(jarnac) +"                      ║")
        console.log("   ╚═════════════════════════════════════════════════════════════╝\n")

        return valid
    }
}

module.exports = new visuels;