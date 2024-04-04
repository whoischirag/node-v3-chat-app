const generateMesssage=(username,text)=>{
return {
    username,
    text,
    createdAt:new Date().getTime()
}

}

const generatelocationMesssage=(username,url)=>{
    return {
        username,
        url,
        createdAt:new Date().getTime()
    }
    
    }
    

module.exports={generateMesssage,generatelocationMesssage
}