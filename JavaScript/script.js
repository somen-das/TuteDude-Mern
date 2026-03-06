// // let a = 10;
// // let b = 20;

// // a **=b
// // console.log(a); // 30


// //  javascript Switch condition example 

// // let day = 10;

// // switch (day) {
// //     case (day > 0 && day <= 9):
// //         console.log(day);
// //         console.log("Group A");
// //         break;
// //     case (day > 9 && day <= 18):
// //         console.log("Group B");
// //         break;
// //    default:
// //         console.log("Not a valid day");
// // }

// // let day2 = 11;

// // switch (true) { // We check which case evaluates to true
// //     case (day2 > 0 && day2 <= 9):
// //         console.log("Group A");
// //         break;
// //     case (day2 > 9 && day2 <= 18):
// //         console.log("Group B"); // This will now execute
// //         break;
// //     default:
// //         console.log("Not a valid day2");
// // }




// let a = 'this is test';

// for ( let i = 1; i <=  5; i++) {
//     // console.log(a + ' ' + i);
// }

// // while loop example

// let j = 0;

// while (j < 5) {
//     // console.log(a+ ' ' + j);
//     j++;
//     // console.log(a+ ' ' + j);

// }

// do{
//     // console.log(a+ ' ' + j);
//     j++
// }while( j < 5);

// const user = { name: "Somen", age: 27 };

// for (let key in user) {
// //   console.log(key);        // name, age
// }

// const arr = [10, 20, 30, 50, 40, 2];
// const arr3 = [{ name: "Somen", age: 27 },{ name: "Das", age: 22 },{ name: "pandit", age: 26 }]

// for (let value of arr3) {
//     const val = value.name;
// //   console.log(val);
// }

//  arr3.map((item, i)=>{
//     // console.log(item.age);
//     return item.name
// })
// //   console.log(values);





// //array in jsvascript exampls

// // let arr1 = [0, 20, 19,  17, 1,];
// //, 12,  2, 11, 3, 13, 4, 15, 5, 15, 6, 18, 7, 14, 8, 9
// // const testSlice = arr1.slice(2,5)
// // const testSplice = arr1.splice(2,5);

// // console.log(arr1)
// // console.log(testSlice)
// // console.log(testSplice)

// let arr1 = [0, 20, 19,  17, 1, 2, 5, 6];
// for( let i = 0; i < arr1.length; i++ ){
//     const indexValue = arr1[i];
//     // console.log(indexValue)
//         for( let j= 0; j < i; j++){
//             // console.log(arr1[j])
//             // console.log(arr1[j])
//             // if(j >0){
//             //     break
//             // }
//         }
// }

//  const sortNum = arr1.sort((a, b) =>{
//     // console.log('a==>',a)
//     // console.log('b==>', b)
//     // console.log('c==>',a - b)
// // return a - b
//  } );

// // console.log(sortNum)


// // function minOperations(s) {
// // }


// function substractFun(word1, word2){
//     // console.log(word2.length)
//     let newStr = '';
//     let max = Math.max(word1.length, word2.length);
//     for(i=0; i < word1.length; i++){
//         // if(word1[i]){
//         //     newStr +=word1[i]
//         // }
//         // if
//         //     (word2[i]){
//         //     newStr +=word2[i]
//         //     }

//         newStr +=word1[i] || ''
//         newStr +=word2[i] || ''
        
//         // for(j = 0; j < word2.length; j++){
//         //     }
//         }

//         console.log('newStr=>',newStr)
// }


// // substractFun('abc', 'de');
// // console.log(substractFun())



// function substractFun2(word1, word2){

//     let result = '';

//     for(let i = 0; i < word1.length; i++){

//         result += word1[i] || '';
//         result += word2[i] || '';

//     }

//     console.log(result);
// }

// // substractFun2('abc','de');



// var mergeAlternately = function(word1, word2) {
//     let newStr = '';
//     for(i = 0; i < word1.length || i < word2.length; i++){
//         newStr += word1[i] || '';
//         newStr += word2[i] || '';
//     }
//     console.log(newStr)
// };

// mergeAlternately('abc', 'pqr')
// mergeAlternately('ab', 'pqrs')
// mergeAlternately('abcd', 'pq')







