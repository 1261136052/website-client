export const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the data'))
    } else {
        callback()
    }
}


export const validateAccount = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the account again'))
    }
    else {
        callback()
    }
}

export const checkPhoneNumber = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error('Please input the phoneNumber'))
    }
    var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (reg.test(value)) {
        return callback(); // 格式正确
    } else {
        return callback(new Error('Please input the right phoneNumber')); // 格式不正确
    }
}


export const checkEmail = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error('Please input the email'))
    }
    var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (reg.test(value)) {
        return callback(); // 格式正确
    } else {
        return callback(new Error('Please input the right email')); // 格式不正确
    }
}


export const checkStudentNumber = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error('Please input the student Number'))
    }
    var reg = /\d+/g;
    if (reg.test(value)) {
        return callback(); // 格式正确
    } else {
        return callback(new Error('Please input the right student Number')); // 格式不正确
    }
}

export const checkAccount = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error('Please input the account'))
    } if (value.length > 11) {
        return callback(new Error('Please input the account < 18 lenght'))
    } else {
        return callback()
    }

}

export const sleep =(ms:any)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const options = [
    {
        value: '广东东软学院',
        label: '广东东软学院',
    },
    {
        value: '广东轻工职业技术学院',
        label: '广东轻工职业技术学院',
    },
    {
        value: '华南师范大学',
        label: '华南师范大学',
    },
    {
        value: '佛山科技学院',
        label: '佛山科技学院',
    },
]