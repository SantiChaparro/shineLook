export const calcPartial=(payments)=>{
    let amountPartial=0;

    payments.forEach(pay => {
      amountPartial += pay.depositAmount
    });

  return amountPartial
}