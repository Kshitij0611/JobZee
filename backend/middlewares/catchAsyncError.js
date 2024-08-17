/*
### Breakdown:

1) catchAsyncErrors: Yeh ek higher-order function hai jo ek function (jo humare pass theFunction ke naam se hai) ko input leta hai aur ek naya function return karta hai.
2) return (req, res, next) => {...}: Yeh naya function ek Express middleware function hota hai jo `req`, `res`, aur `next` parameters leta hai.
3) Promise.resolve(theFunction(req, res, next)): Yeh line theFunction ko call karta hai aur ensure karta hai ki yeh ek Promise return kare.
4) .catch(next): Agar is Promise mein koi error aata hai, toh yeh error catch ho jata hai aur `next` function ko pass kar di jati hai, jo Express ko yeh batata hai ki error handling middleware ko call karna chahiye.

Simpler terms mein, yeh function ensure karta hai ki agar aapka asynchronous code mein koi bhi error aati hai, toh woh error properly handle ho sake aur aapka server crash na ho.

*/

export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
