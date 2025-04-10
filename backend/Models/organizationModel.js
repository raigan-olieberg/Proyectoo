class Organization {
    constructor(
        organizationName,
        organizationAddress,
        organizationAllocatedDocumentData,
        organizationAdmins,
        organizationMemberstotal
    ){
        (this.organizationName = organizationName),
        (this.organizationAddress = organizationAddress),
        (this.organizationAllocatedDocumentData = organizationAllocatedDocumentData),
        (this.organizationAdmins = organizationAdmins),
        (this.organizationMemberstotal = organizationMemberstotal);
    }
}

export default Organization;