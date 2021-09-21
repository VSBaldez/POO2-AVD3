import React, { useState, useEffect } from 'react'
import { ScrollView, Text, StyleSheet, TextInput, Platform, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import { Button } from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface IRegisterData {
  id: string;
  codigoPais: string;
  nomePais: string;
}

export function Home(){
  const [newStatus, setNewStatus] = useState('ADD')
  const [newTitleForm, setNewTitleForm] = useState('Formulário de Cadastro')
  const [newButtonForm, setNewButtonForm] = useState('Adicionar')
  const [newButtonCancelVisible, setNewButtonCancelVisible] = useState(false)
  const [newCodigoPais, setNewCodigoPais] = useState('')
  const [newNomePais, setNewNomePais] = useState('')
  const [myRegister, setMyRecords] = useState<IRegisterData[]>([]);

  const showConfirmDialog = (id : string) => {
    return Alert.alert(
      "Aviso",
      "Deseja realmente apagar?",
      [
        {
          text: "Sim",
          onPress: () => {
            handleRemoveRegister(id)
          },
        },
        {
          text: "Não",
        },
      ]
    );
  }

  useEffect(() => {
    async function loadData(){
      const storagedData = await AsyncStorage.getItem('@data:records')
      if(storagedData){
        setMyRecords(JSON.parse(storagedData))
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    async function saveData(){
      await AsyncStorage.setItem('@data:records', JSON.stringify(myRegister))
    }
    saveData()
  }, [myRegister])

  const [greeting, setGreeting] = useState('')

  function handleAddNewRegister(){
    let option = newStatus
    if(option == 'ADD'){
    const data = {
      id: String(new Date().getTime()),
      codigoPais: newCodigoPais,
      nomePais: newNomePais
    }
    if(data.codigoPais.trim() == '' || data.nomePais.trim() == ''){
      Alert.alert(
        'Preencha o formulário corretamente.'
      )
    } else {
      setMyRecords([...myRegister, data])
      setNewCodigoPais('')
      setNewNomePais('')
      Alert.alert(
        'Cadastro realizado com sucesso.'
     )
    }
  } else {

    let data = {
      id: option,
      codigoPais: newCodigoPais,
      nomePais: newNomePais
    }

    if(data.id.trim() == '' || data.codigoPais.trim() == '' || data.nomePais.trim() == ''){
      Alert.alert(
        'Preencha o formulário corretamente.'
      )
      

    } else {


    
      let objIndex = myRegister.findIndex((obj => obj.id == option));
      myRegister[objIndex] = data
      AsyncStorage.setItem('@data:records', JSON.stringify(myRegister));
  
      
      async function loadData(){
        const storagedData = await AsyncStorage.getItem('@data:records')
        if(storagedData){
          setMyRecords(JSON.parse(storagedData))
        }
      }
      loadData()
  
      setNewCodigoPais('')
      setNewNomePais('')
      setNewTitleForm('Formulário de Cadastro')
      setNewButtonForm('Adicionar')
      setNewStatus('ADD')
      setNewButtonCancelVisible(false)

      Alert.alert(
        'Alterado com sucesso.'
      )

    }






    

  }
  }


  function updateCancel(){
    setNewCodigoPais('')
    setNewNomePais('')
    setNewTitleForm('Formulário de Cadastro')
    setNewButtonForm('Adicionar')
    setNewStatus('ADD')
    setNewButtonCancelVisible(false)
  }

  function handleUpdateRegister(id: string){
    
    setNewTitleForm('Editar - ID: '+id)
    setNewButtonForm('Salvar')
    setNewButtonCancelVisible(true)
    async function updateData(){
      const storagedData = await AsyncStorage.getItem('@data:records')
      if(storagedData){
      let objConvert = JSON.parse(storagedData)
      
      let objIndex = objConvert.filter(function(e : IRegisterData){
        return e.id == id
        
    })
    setNewStatus(objIndex[0].id)
    setNewCodigoPais(objIndex[0].codigoPais)
    setNewNomePais(objIndex[0].nomePais)
    
      }
    }
    updateData()
  }

  function handleRemoveRegister(id: string){
    async function removeData(){
      const storagedData = await AsyncStorage.getItem('@data:records')
      if(storagedData){
        const updateData = setMyRecords(JSON.parse(storagedData).filter(function(e : IRegisterData){
          return e.id !== id

      }))
      AsyncStorage.setItem('@data:records', JSON.stringify(updateData));
      }
    }
    removeData()
  }

  useEffect(() =>{
    const currentHour = new Date().getHours();
    if(currentHour >= 5 && currentHour < 12){
      setGreeting('Bom dia!')
    } else if(currentHour >= 12 && currentHour <18){
      setGreeting('Bos tarde!')
    } else {
      setGreeting('Bos noite!')
    }
  }, [])

  return (
    <>
      <ScrollView horizontal={false} style={styles.container}>
        <ScrollView horizontal={false}>
        <Text style={[styles.title, {color: '#f7ce25'}]}>POO2 - AVD3 - PAÍSES</Text>
        <Text style={styles.title}>Bem-vindo, Victor S. Baldez.</Text>
        <Image style={{width:300, height:300, position:'relative', marginBottom:30, left:'50%', transform: [
        { translateX: -150 },
        { translateY: 10},
      ]}} source={require('../images/world.png')} />
      <Text style={[styles.titleSimple, {marginVertical: 0}]}>
          {newTitleForm}
        </Text>
        <TextInput keyboardType="default" style={[styles.input, {display: 'none'}]} placeholder='Status' value={newStatus} placeholderTextColor='#555' onChangeText={value => setNewStatus(value)} onSubmitEditing={handleAddNewRegister} />
        <TextInput keyboardType="default" style={styles.input} placeholder='Código do País' value={newCodigoPais} placeholderTextColor='#555' onChangeText={value => setNewCodigoPais(value)} onSubmitEditing={handleAddNewRegister} />
        <TextInput keyboardType="email-address" style={styles.input} placeholder='Nome do País' value={newNomePais} placeholderTextColor='#555' onChangeText={value => setNewNomePais(value)} onSubmitEditing={handleAddNewRegister} />
        <Button 
          onPress={handleAddNewRegister} 
          title={newButtonForm}
        />


        

          
{newButtonCancelVisible ?
        <Button 
          onPress={updateCancel} 
          title='Cancelar Edição'
          style={{backgroundColor: '#ca4e42',
          padding: Platform.OS == 'ios' ? 15 : 10,
          borderRadius: 7,
          alignItems: 'center',
          marginTop: 10}}
        />

        :
      <></>
    }

        



        <Text style={[styles.title, {marginVertical: 20}]}>
          Países
        </Text>
        <FlatList style={styles.flatList}
        data={myRegister} 
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={()=>showConfirmDialog(item.id)} key={item.id} style={styles.buttonSimple}>
                <Text style={{width: '100%'}}>
                {'\n    '}
                  <Text style={{width: 40, fontSize:15, height: 80, padding: 10, backgroundColor: 'transparent'}}>{item.codigoPais}         </Text>
                  <Text style={{width: 40, fontSize:15, height: 80, padding: 10, backgroundColor: 'transparent'}}>{item.nomePais}</Text>
                  <Text style={{width: 'auto',  height: 20, padding: 0, backgroundColor: 'transparent'}}></Text>
                  {'\n'}
                </Text>
                
                <Text style={[styles.textSimple, {display: 'none'}]}>
                  <Text style={{fontSize: 24}}>{item.codigoPais}{"\n"}</Text>
                  <Text style={{fontSize: 20}}>{item.nomePais}</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>handleUpdateRegister(item.id)} key={item.id+item.id} style={styles.buttonUpdate}>
                <Text style={styles.textSimple}>
                  <Text>Editar</Text>
                </Text>
            </TouchableOpacity>
            {/*
            <TouchableOpacity onPress={()=>handleUpdateRegister(item.id)} key={item.id+item.id} style={styles.buttonUpdate}>
                <Text style={styles.textSimple}>
                  <Text>Editar</Text>
                </Text>
            </TouchableOpacity>
            */}
          </>
        )}>
        </FlatList>
        </ScrollView>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00629c',
      paddingHorizontal: 30,
      paddingVertical: 30,
    },
    title: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold'
    },
    input: {
      backgroundColor: '#bcd8ed',
      color: '#00629c',
      fontSize: 18,
      padding: Platform.OS == 'ios' ? 15 : 10,
      marginTop: 30,
      borderRadius: 7,
    },
    greetings: {
      color: '#fff',
      fontSize: 15
    },
    buttonSimple: {
      backgroundColor: '#FFF',
      //padding: Platform.OS == 'ios' ? 15 : 10,
      alignItems: 'center',
      marginTop: 10
    },
    buttonUpdate: {
      backgroundColor: '#424242',
      padding: 8,
      
      alignItems: 'center'
    },
    textSimple: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    },
    flatList: {
      paddingBottom: 50
    },
    titleSimple: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30
    },
    titleSimpleUpdate: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30
    },
})