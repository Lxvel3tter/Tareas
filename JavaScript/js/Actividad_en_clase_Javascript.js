/*

Escribe una función llamada popularString que tome una lista de cadenas de texto y devuelva la cadena más frecuente.
Escribe una función llamada isPowerOf2 que tome un número y devuelva verdadero si es una potencia de dos, falso de lo contrario.
Escribe una función llamada sortDescending que tome una lista de números y devuelva una nueva lista con todos los números en orden descendente.

*/


function firstNonRepeating(string_a){
    
    let string_A=string_a;

    for(let i=0; i < string_A.length;i++){
        let counter=0;

        for(let j=0; j < string_A.length;j++){
            if(string_A[i]==string_A[j]){
            counter++;}
        }

        if(counter==1){
            return string_A[i]
        }

    }

}



console.log(firstNonRepeating())








