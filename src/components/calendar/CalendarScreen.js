import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal.js';


import { uiOpenModal } from '../../actions/ui';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { eventClearActiveEvent, eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';




moment.locale('es');

const localizer = momentLocalizer(moment); // or globalizeLocalizer


/* const events = [{
    title: 'Cumpleaños del jefe',
    start: moment().toDate(), //new Date()
    end: moment().add( 2, 'hours' ).toDate(), //new Date()
    bgcolor: '#fafafa',
    notes: 'Comprar el pastel',
    user: {
        _id: '123',
        name: 'Fernando'
    }
}]
 */

export const CalendarScreen = () => {

    const dispatch = useDispatch();


    //TODO: Leer del Store, los eventos
    const { events, activeEvent } = useSelector(state => state.calendar)



    const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'month' );

    const onDoubleClick = (e) => {
        //console.log(e);
        //console.log('Abrir Modal');
        dispatch( uiOpenModal() );
    }


    const onSelectEvent = (e) => {
        
        dispatch( eventSetActive( e ) );
        //dispatch( uiOpenModal() );

        //console.log(e);
        //console.log('Click');
    }


    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
        //console.log(e);
    }


    const onSelectSlot = (e) => {

        //console.log(e);
        dispatch( eventClearActiveEvent() );

    }


    const eventStyleGetter = ( event, start, end, isSelected ) => {
        
        const style = {
            backgroundColor: '#367CF7',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    };


    return (
        <div className="calendar-screen">

            <Navbar />


            <Calendar
                localizer={ localizer }
                events={ events }
                startAccessor="start"
                endAccessor="end"
                messages = { messages }
                eventPropGetter = { eventStyleGetter }
                onDoubleClickEvent = { onDoubleClick }
                onSelectEvent = { onSelectEvent }
                onView = { onViewChange }
                onSelectSlot={ onSelectSlot }
                selectable={ true }
                view = { lastView }
                components = {{ 
                    event: CalendarEvent 
                }}
            />


            <AddNewFab />


            {

                ( activeEvent ) && <DeleteEventFab />

            }


            <CalendarModal />
            
            

        </div>
    )
}




