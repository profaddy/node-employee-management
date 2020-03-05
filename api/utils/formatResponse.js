const formatResponse = (status = false,message ="",data={}) => {
    return {
        status:status,
        message:message,
        ...data
    }
}

module.exports = formatResponse