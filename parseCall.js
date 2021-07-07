function parseCall(call){
	try{ 
        if (call.length!=32 || !call.match(/[\d|' ']{32}/)){
            throw "Incorrect call!"
        }
		callObj = {
			duration: 60*parseInt(call.substring(0,2),10) + parseInt(call.substring(2,4),10),
			startDate: Date.parse(call.substring(9,13) + "-" + call.substring(5,7) + "-" + call.substring(8,9)),
			accessCode: parseInt(call.charAt(14)),
			dialedNumber: call.substring(16,22),
			chargedNumber: call.substring(23,29),
			timeInQueue: parseInt(call.substring(30))
		};
		reg = /\d{6}/;
        console.log(callObj);
		if(!reg.test(callObj.dialedNumber) || !reg.test(callObj.chargedNumber)) {
            throw "Incorrect phone number!";
        }			
		return callObj;
	} catch(ex) {
		throw ex;
	}		
}

try{
    console.log(parseCall("0506 06132220 9 474001 257251 10"));
} catch(ex) {
    console.log(ex);
}