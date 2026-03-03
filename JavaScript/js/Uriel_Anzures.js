/*
 * Example functions to practice JavaScript
 *
 * 
 * 2025-02-12
 * Uriel Anzures Garcia.
 */

"use strict";


function firstNonRepeating(string_a){
    
    let string_A=string_a;

    for(let i=0; i < string_A.length;i++){
        let counter=0;

        for(let j=0; j < string_A.length;j++){
            if(string_A[i]==string_A[j]){
            counter++;}
        }

        if(counter==1){
            let resultado = string_A[i];
            console.log(resultado);
            return resultado;
        }
    }
    console.log(undefined);
    return undefined;

}
function bubbleSort(arr){
  
    for(let i = 0; i < arr.length -1; i++){  
        for(let j = 0; j < arr.length -1; j++){ 
            if(arr[j] > arr[j+1]){  
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];         
                }
            }
        }
    console.log(arr);
    return arr;
}
function invertArray(arr) {
   
    let mod = [];
    for (let i = 0; i < arr.length; i++) {
        mod[i] = arr[i];
    }

   
    let i = 0;
    let j = mod.length - 1;

    while (i < j) {
        let temp = mod[i];
        mod[i] = mod[j];
        mod[j] = temp;

        i++;
        j--;
    }

    console.log(mod);
    return mod;
}
function invertArrayInplace(arr){
    let i = 0;
    let j = arr.length - 1;

    while (i < j) {

        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        i++;
        j--;
    }

    console.log(arr);
    return arr;
}
function  capitalize(arr){
    if(arr.length==0){
        console.log("");
        return "";
    }else{

    let text = arr;
    const n_array = text.split(" ");
    let upper=n_array.map(l => l[0].toUpperCase()+l.slice(1));

    let resultado = upper.join(" ");
    console.log(resultado);
    return resultado;
    }
    
}
function mcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    console.log(a);
    return a;
}
function hackerSpeak(arr) {
    if (arr.length === 0) {
        console.log("");
        return "";
    }else{
    let stringa = arr.split("");
    let hs = stringa.map(l => {if (l === "a") return "4";if (l === "e") return "3";if (l === "i") return "1";if (l === "o") return "0";if (l === "s") return "5";
        return l;});
    let resultado = hs.join("");
    console.log(resultado);
    return resultado;
    }
  
}
function  factorize(num){
  let factores = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factores.push(i);
    }
  }
  console.log(factores);
  return factores;
}
function    deduplicate(arr){
    if(arr.length==0){
        console.log(arr);
        return arr;
    }else{
    let nodp=new Set(arr);
    let resultado = Array.from(nodp);
    console.log(resultado);
    return resultado;}
}
function    findShortestString(arr) {
    if (arr.length === 0) {
        console.log(0);
        return 0;
    }

    let min = arr[0].length;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length < min) {
            min = arr[i].length;
        }
    }

    console.log(min);
    return min;
}
function isPalindrome(string) {

    let arreglo = string.split("");

    let invertido = invertArray(arreglo);

    let invertidoString = invertido.join("");

    let resultado = string === invertidoString;
    console.log(resultado);
    return resultado;
}
function sortStrings(arr) {
    if(arr.length==0){
        console.log(arr);
        return arr;
    }
 
    let copia = [];
    for (let i = 0; i < arr.length; i++) {
        copia[i] = arr[i];
    }
    
    copia.sort(); 
    console.log(copia);
    return copia;
}
function stats(arr){
    if(arr.length==0){
        console.log([0,0]);
        return [0,0];
    }
    let sum=0;

    for(let i=0;i<arr.length;i++){
        sum=sum+arr[i];
    }

    let prom=sum/arr.length;
    let max_count=0;
    let moda_num=0;

    for(let i=0;i<arr.length;i++){
        let count=0;
        for(let j=0;j<arr.length;j++){
            if(arr[i]==arr[j]){
                count++;
            }
        }
        if(count>max_count){
            max_count=count;
            moda_num=arr[i];
        }
    }
    let resultado = [prom, moda_num];
    console.log(resultado);
    return resultado;
}
function popularString(arr){
    if(arr.length==0){
        console.log("");
        return "";
    }

    let masFrecuente=arr[0];
    let maxVeces=1;

    for(let i=0;i<arr.length;i++){
        let contador=0;
        for(let j=0;j<arr.length;j++){
            if(arr[i]==arr[j]){
                contador++;
            }
        }

        if(contador>maxVeces){
            maxVeces=contador;
            masFrecuente=arr[i];
        }
    }

    console.log(masFrecuente);
    return masFrecuente;
}
function isPowerOf2(n){
    if(n<=0){
        console.log(false);
        return false;
    }

    while(n%2==0){
        n=n/2;
    }

    let resultado = n==1;
    console.log(resultado);
    return resultado;
}
function sortDescending(arr){
    if(arr.length==0){
        console.log([]);
        return [];
    }

    let copia=[];
    for(let i=0;i<arr.length;i++){
        copia[i]=arr[i];
    }

    for(let i=0;i<copia.length-1;i++){
        for(let j=0;j<copia.length-1;j++){
            if(copia[j]<copia[j+1]){
                let temp=copia[j];
                copia[j]=copia[j+1];
                copia[j+1]=temp;
            }
        }
    }

    console.log(copia);
    return copia;
}

export {
    firstNonRepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,
};