const Login = 'login';
const LoginOut = 'loginOut';
import createHistory from 'history/createHashHistory';
import fetch from '../component/fetch';
const history = createHistory();
const initData = {
    token: localStorage.getItem('token'),
    isLogin: localStorage.getItem('isLogin'),
    user: 'lili',
    tableData:[],
    tableDataUs:[],
    total:0,
    _token:localStorage.getItem('_token')
}

console.dir(history)
if (initData.isLogin) {
    // fetch
    // var formData = new FormData();
    // formData.append('token', initUser.token);
    // var opts = {
    //     method: "POST", //请求方法
    //     body: formData, //请求体
    //     credentials: 'include'
    // }
    // fetch('http://43.246.214.1/zjh/admin/info/q', opts).then(res => {
    //     return res.json();
    // }).then(resData => {
    //     if (resData.status > 650) {
    //         initUser.isLogin = false;
    //         history.push('./')
    //     }
    // }).catch((error) => {
    //     initUser.isLogin = false;
    //     history.push('./')
    // })
}



export function userLogin(state = initData, action) {
    switch (action.type) {
        case Login:
            localStorage.setItem('isLogin', true)
            localStorage.setItem('_token',action.userdata.data.token)
            return Object.assign(state,{ isLogin: true,_token:action.userdata.data.token, token: action.userdata,user:action.userdata.data._id})
        case LoginOut:
            localStorage.clear();
            return { isLogin: false }
        case 'article':
            if(action.tableData.status==='ok'){
                console.log(action.tableData.data.listdata,66)
                return Object.assign(state,{tableData:action.tableData.data.listdata,total:action.tableData.data.total})
            }else{
                localStorage.clear();
                return Object.assign(state,{isLogin:false})
            }
        case 'AboutUs':
            if(action.tableData.status==='ok'){
                return Object.assign(state,{tableDataUs:action.tableData.data.listdata,total:action.tableData.data.total})
            }else{
                localStorage.clear();
                return Object.assign(state,{isLogin:false})
            }
        default:
            return state
    }
}



export function login(userdata) {
    return { type: Login, userdata: userdata }
}
export function loginFn(resdata) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            fetch('userLogin',{'name':resdata.loginName,'password':resdata.password}).then(data => {
                if(data.status==='ok') dispatch(login(data))
                resolve(data)
            })
        })
    }
}
export function article(data) {
    return { type: 'article', tableData: data }
}
export function ArticleFn(type,formValue) {
    console.log(type,formValue)
    return dispatch => {
        return new Promise((resolve, reject) => {
            fetch('article', Object.assign({type:type,_token:initData._token},formValue)).then(data => {
                    type==='delete'?null:dispatch(article(data))
                resolve(data)
            })
        })
    }
}


export function aboutUs(data) {
    return { type: 'AboutUs', tableData: data }
}
export function aboutUsFn(type,formValue) {
    console.log(111)
    return dispatch => {
        return new Promise((resolve, reject) => {
            fetch('AboutUs', Object.assign({type:type,_token:initData._token},formValue)).then(data => {
                    type==='delete'?null:dispatch(aboutUs(data))
                resolve(data)
            })
        })
    }
}



export function loginout() {
    return { type: LoginOut }
}