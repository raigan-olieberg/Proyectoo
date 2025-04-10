// React / NextJs components
import { useRef, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import SidebarComponentFieldsSelect from './Select';
import { GLOBALFUNC__EditOrganizationBytes } from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const SidebarComponentFieldsFileUpload = (props) => {
    const hiddenFileInput = useRef(null);
    const FUNC__AddFile = (
        files
    ) => {
        const arrFiles = Array.from(files);
        if(arrFiles.length > 0){
            arrFiles.map((file, index) => {
                if(props.itemObjectFiles.find((element) => element.name == file.name && element.lastModified == file.lastModified)){
                    arrFiles.splice(index, 1);
                    console.log('found');
                    return;
                }
                file['file_id'] = '';
                file['url'] = FUNC__AddFile__CreateUrl(file);
            });
            
            const newItemObjectFiles = props.itemObjectFiles.concat(arrFiles);
            props.setItemObjectFiles(newItemObjectFiles);

            const newAddedItemObjectFiles = props.addedItemObjectFiles.concat(arrFiles);
            props.setAddedItemObjectFiles(newAddedItemObjectFiles);

            FUNC__AddFile__UpdateOrganizationfileStorage(arrFiles);
            FUNC__AddFile__DeleteFromDeletedItemObjectFiles(arrFiles);
        }
        hiddenFileInput.current.value = null;
    }
    const FUNC__AddFile__CreateUrl = (
        file
    ) => {
        let blob = new Blob([file]);
        let url  = URL.createObjectURL(blob);
        return url;
    }
    const FUNC__AddFile__UpdateOrganizationfileStorage = (
        files
    ) => {
        let newOrganizationfileStorage = {...props.organizationfileStorage};
        files.map(file => {
            newOrganizationfileStorage.used += file.size;
        });
        props.setOrganizationfileStorage(newOrganizationfileStorage);
    }
    const FUNC__AddFile__DeleteFromDeletedItemObjectFiles = (
        files
    ) => {
        const newDeletedItemObjectFiles = [...props.deletedItemObjectFiles];
        files.map(file => {
            const fileToDeleteIndex = newDeletedItemObjectFiles.findIndex(element => element.name == file.name && element.lastModified == file.lastModified);
            if(fileToDeleteIndex !== -1){
                console.log('file removed from deleted object');
                newDeletedItemObjectFiles.splice(fileToDeleteIndex, 1);
            }
        });

        console.log(newDeletedItemObjectFiles);
        props.setDeletedItemObjectFiles(newDeletedItemObjectFiles);
    }
    const FUNC__DeleteFile = (
        file,
        index
    ) => {
        const newItemObjectFiles = [...props.itemObjectFiles];
        newItemObjectFiles.splice(index, 1);
        props.setItemObjectFiles(newItemObjectFiles);

        let newOrganizationfileStorage = {...props.organizationfileStorage};
        newOrganizationfileStorage.used -= file.size;
        props.setOrganizationfileStorage(newOrganizationfileStorage);

        if(file.file_id){
            console.log('file deleted');
            const newDeletedItemObjectFiles = [...props.deletedItemObjectFiles];
            newDeletedItemObjectFiles.push(file);
            props.setDeletedItemObjectFiles(newDeletedItemObjectFiles);
        }

        const fileToDeleteIndex = props.addedItemObjectFiles.findIndex(element => element.name == file.name && element.lastModified == file.lastModified);
        if(fileToDeleteIndex !== -1){
            console.log('file removed from added object');
            const newAddedItemObjectFiles = [...props.addedItemObjectFiles];
            newAddedItemObjectFiles.splice(fileToDeleteIndex, 1);
            props.setAddedItemObjectFiles(newAddedItemObjectFiles);
        }
    }
    /*
        Use example:
            
    */
    return(
        <>
            <div className={cn([
                globalStyles['bodysection-field'],
                globalStyles['global-margin-top']
            ])}>
                <div className={globalStyles['bodysection-field__label']}>{props.title}</div>
                {
                    props.subTitle != undefined
                    &&
                    <div className={cn([
                        globalStyles['global-margin-subtext'],
                        globalStyles['global-margin-bottom-item']
                    ])}>{props.subTitle}</div>
                }
                {
                    props.itemObjectFiles.length > 0
                    &&
                    props.itemObjectFiles.map((file, index) =>
                        file != undefined
                        &&
                        <div key={file.name} className={cn([
                            globalStyles['bodysection-field__non-input-with-button'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-animation-fadein'],
                            globalStyles['bodysection-field__file-input']
                        ])}>
                            <div>
                                <a href={file.url} target="_blank" download={file.name}>{file.name.length > 50 && file.name.substring(0, 47) + "..." || file.name}</a>
                                {/*
                                    props.signatureRequired != undefined
                                    &&
                                    <>
                                        <div className={cn([
                                            globalStyles['global-seperator__horizontal'],
                                            globalStyles['global-margin-top-item'],
                                            globalStyles['global-margin-bottom-item']
                                        ])}></div>
                                        <SidebarComponentFieldsSelect 
                                            firstItem={true} 
                                            title={"Digitale handtekening vereist"}
                                            id={"appendix_signature"} 
                                            value={file.signature_required}
                                            type={"create"}
                                            error={{show: false}}
                                            options={[
                                                {
                                                    key: "No",
                                                    value: "Niet van toepassing"
                                                },
                                                {
                                                    key: "Yes",
                                                    value: "Ja, handtekening is vereist"
                                                }   
                                            ]}
                                            required={true}
                                            transparent={true}
                                            upperCase={file.name}
                                            FUNC__CreateObject={props.FUNC__CreateObject}/>
                                    </>
                                */}
                            </div>   
                            {          
                                !props.hideButtons
                                &&
                                <button className={cn([
                                    globalStyles['bodysection-field__non-input-with-button--button'],
                                    globalStyles['global-transition-duration'],
                                    globalStyles['global-button-cancel-hover-icon-only']
                                ])} onClick={() => FUNC__DeleteFile(
                                    file, 
                                    index
                                )}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: ".9vw", width: ".9vw"})}}></i></button>  
                            }        
                        </div>
                    )
                }
                {
                    props.itemObjectFiles.length == 0
                    && props.action == "edit"
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field__non-input-with-button'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-animation-fadein']
                    ])}>-</div>
                }
            </div>
            {
                !props.dataIsLoading
                && !props.hideButtons
                &&
                <div className={cn([
                    globalStyles['bodysection-field__input'],
                    globalStyles['global-margin-top-item']
                ])}>
                    <button className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button__full-width'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])} onClick={() => hiddenFileInput.current.click()}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['upload'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        {props.buttonText}
                    </button>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={e => {FUNC__AddFile(e.target.files); }} 
                        style={{display: 'none'}}
                        multiple/>
                </div>
            }
        </>
    );
}
export default SidebarComponentFieldsFileUpload;