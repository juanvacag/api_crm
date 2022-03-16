import React from 'react'
import {Formik, Form, Field} from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Alerta from './Alerta'
import Spinner from './Spinner'

const formulario = ({cliente, cargando}) => {

    const navigate = useNavigate()

    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
                    .min(3, 'El nombre del cliente es muy corto')
                    .max(20,'El nombre del cliente es muy largo')
                    .required('El nombre del cliente es obligatorio'),
        
        empresa: Yup.string()   
                    .required('El nombre de la empresa es obligatorio'),
                    
        email: Yup.string()
                    .email('Email no valido')   
                    .required('El email es obligatorio'),  
                    
        telefono: Yup.number()
                        .positive('Numero no válido')
                        .integer('Numero no válido')
                        .typeError('Numero no válido'),
    })

    const handleSubmit = async (valores) => {
        try {
          let respuesta;
          if (cliente.id) {
                    //editando cliente
                    const url = `http://localhost:4000/clientes/${cliente.id}`
                    respuesta = await fetch(url, {
                    method: "PUT",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json",
                    },
            })
          } else {
                    //nuevo cliente
                    const url = 'http://localhost:4000/clientes'
                    respuesta = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json",
                    },
            })
          }

          await respuesta.json();

          // TODO este es el codigo original
          // console.log(respuesta)
          // const resultado = await respuesta.json()
          // console.log(resultado)

          navigate("/clientes");

        } catch (error) {
            console.log(error)
        }
    }

  return (
      cargando ? <Spinner /> :(
    <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
        <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>{cliente.nombre ? 'Editar Cliente' :'Agregar Cliente'}</h1>
        <Formik
            initialValues={{
                nombre: cliente.nombre ? cliente.nombre : "",   //version del ternario
                empresa: cliente?.empresa ?? "",//version mas moderna
                email: cliente.email ? cliente.email : "", //este operador se llama
                telefono: cliente?.telefono ?? "", //Nullish coalescing operator(??)
                notas: cliente.notas ? cliente.notas : "",
            }}
            enableReinitialize={true}
            onSubmit={ async (values, {resetForm}) => {
                //console.log(values)
                await handleSubmit(values)

                resetForm()
            }}
            validationSchema={nuevoClienteSchema}
        >
            {({errors, touched}) => {
                //console.log(touched)
                return (
            
            <Form className='mt-10'>
                <div className='mb-4'>
                    <label
                        className='text-gray-800'
                        htmlFor='nombre'
                    >Nombre:</label>
                    <Field 
                        id='nombre'
                        type='text'
                        className='mt-2 block w-full p-3 bg-gray-50'
                        placeholder='Nombre del Cliente'
                        name='nombre'/>

                    {errors.nombre && touched.nombre ? (
                        <Alerta>{errors.nombre}</Alerta>
                    ) : null }    
                </div>

                <div className='mb-4'>
                    <label
                        className='text-gray-800'
                        htmlFor='empresa'
                    >Empresa:</label>
                    <Field 
                        id='empresa'
                        type='text'
                        className='mt-2 block w-full p-3 bg-gray-50'
                        placeholder='Nombre de la Empresa del Cliente'
                        name='empresa'/>

                    {errors.empresa && touched.empresa ? (
                        <Alerta>{errors.empresa}</Alerta>
                    ) : null } 
                </div>

                <div className='mb-4'>
                    <label
                        className='text-gray-800'
                        htmlFor='email'
                    >E-mail:</label>
                    <Field 
                        id='email'
                        type='email'
                        className='mt-2 block w-full p-3 bg-gray-50'
                        placeholder='Email del Cliente'
                        name='email'/>
                    {errors.email && touched.email ? (
                        <Alerta>{errors.email}</Alerta>
                    ) : null }     

                </div>

                <div className='mb-4'>
                    <label
                        className='text-gray-800'
                        htmlFor='telefono'
                    >Telefono:</label>
                    <Field 
                        id='telefono'
                        type='tel'
                        className='mt-2 block w-full p-3 bg-gray-50'
                        placeholder='Teléfono del Cliente'
                        name='telefono'/>
                    {errors.telefono && touched.telefono ? (
                        <Alerta>{errors.telefono}</Alerta>
                    ) : null }  
                </div>

                <div className='mb-4'>
                    <label
                        className='text-gray-800'
                        htmlFor='notas'
                    >Notas:</label>
                    <Field 
                        as='textarea'
                        id='notas'
                        type='text'
                        className='mt-2 block w-full p-3 bg-gray-50 h-40'
                        placeholder='Notas del Cliente'
                        name='notas'/>
                </div>

                <input
                    type='submit'
                    value={cliente.nombre ? 'Editar Cliente' :'Agregar Cliente'}
                    className='mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg cursor-pointer'
                />
               
            </Form>
            )}}
        </Formik>
    </div>
    )
  )
}
formulario.defaultProps = {
    cliente: {},
    cargando: false
}

export default formulario