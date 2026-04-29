import {create} from "zustand";

export const useUIStore = crate((set) =>({
    
    nodal: null,
    confirm: null,

    OpenModal: (title,message,onClose)=> set(
        {
        modal : {title,message,onClose}
       }
    ),

    CloseModal: ()=> set ({modal:null}),

    OpenConfirm: (title,message,OpenConfirm,onClose)=> set ({

 confirm: {title,message,onConfirm,onCancel}   
}),
closeConfirm: ()=> set ({confirm:null})
 
}));