import React from 'react';

const ConfirmBlock = ({blockState}) => {
    return (
        <div className='modal fade' id='ConfirmBlock' data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                    <div className="modal-body">
                        <p className='text-dark text-center'>Are you sure want to block this person?</p>
                        <div className='d-flex justify-content-between'>
                            <button onClick={()=>blockState(true)} className='btn btn-success' data-bs-dismiss="modal">Yes</button>
                            <button className='btn btn-danger' data-bs-dismiss="modal" onClick={()=>blockState(false)}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBlock;