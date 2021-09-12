import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/events';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');


const now = moment().minutes(0).seconds(0).add(1,'hours');


const nowPlus1 = now.clone().add(1, 'hours');


const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}



export const CalendarModal = () => {


    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar);
    const dispatch = useDispatch();


    const [ dateStart, setDateStart ] = useState( now.toDate() );
    // dateEnd: const [dateStart, setDateStart] = useState( now.toDate() );
    // dateEnd +1 dateStart...


    const [ dateEnd, setDateEnd ] = useState( nowPlus1.toDate() );


    const [ titleValid, setTitleValid ] = useState(true);


    const [formValues, setFormValues] = useState( initEvent );


    const { notes, title, start, end } = formValues;


    useEffect(() => {
        
        if( activeEvent ) {

            setFormValues( activeEvent );

        } else {

            setFormValues( initEvent );

        }
    }, [activeEvent, setFormValues])


    const handleInputChange = ({ target }) => {

        setFormValues({
            ...formValues,
            [target.name]: target.value
        });

    }



    //Creación de la función
    const closeModal = () => {

        dispatch( uiCloseModal() );


        dispatch( eventClearActiveEvent() );


        setFormValues( initEvent );
        
        
        //console.log('Cerrar Modal');

        //TODO: Cerrar el modal

        //setIsOpen( false );
        //console.log('Closing');
    }


    const handleStartDateChange = ( e ) => {
        setDateStart( e );
        setFormValues({
            ...formValues,
            start: e
        })
        //console.log( e );
    }


    const handleEndDateChange = ( e ) => {
        setDateEnd( e );
        setFormValues({
            ...formValues,
            end: e
        })
        //console.log( e );
    }


    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment( start );


        const momentEnd = moment( end );


        if( momentStart.isSameOrAfter( momentEnd ) ) {

            return Swal.fire('Error', 'La fecha fin debe ser mayor a la fecha de inicio', 'error');

            //console.log('Fecha 2 debe ser maoyor');

        }


        if( title.trim().length < 2 ) {

            return setTitleValid(false);

        }


        if( activeEvent ) {
            //Actualizando
            dispatch( eventUpdated( formValues ) )

        } else {
            //Creando un nuevo conjuto de datos
            //TODO: Realizar la grabación en base de datos
            //console.log(formValues);
            dispatch( eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'John'
                }
            }) );

        }


        






        setTitleValid(true);


        closeModal();


        


        //console.log(momentStart);
        //console.log(momentEnd);


        //console.log( formValues );
    }


    return (

        <Modal
            isOpen={ modalOpen }
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200} //200
            className="modal"
            overlayClassName="modal-fondo"
        >

            <h1> { (activeEvent) ? 'Editar Evento' : 'Nuevo Evento' } </h1>
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmitForm }
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={ handleStartDateChange }
                        value={ dateStart }
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                            onChange={ handleEndDateChange }
                            value={ dateEnd }
                            minDate= { dateStart }
                            className="form-control"
                            format="y-MM-dd h:mm:ss a"
                            amPmAriaLabel="Select AM/PM"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className= { `form-control ${ !titleValid && 'is-invalid' }` }
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange={ handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ notes }
                        onChange={ handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>

        </Modal>
    )
}


//9 min