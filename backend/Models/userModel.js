class User {
    constructor(
        userFirstname,
        userLastname,
        userRole,
        userLabel,
        userEmail,
        userPassword,
        userStatus
    ){
        (this.userFirstname = userFirstname),
        (this.userLastname = userLastname),
        (this.userRole = userRole),
        (this.userLabel = userLabel),
        (this.userEmail = userEmail),
        (this.userPassword = userPassword),
        (this.userStatus = userStatus);
    }
}

export default User;