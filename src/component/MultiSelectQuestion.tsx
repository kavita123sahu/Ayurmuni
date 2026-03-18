import React from 'react';
import {
View,
Text,
TouchableOpacity,
StyleSheet,
Image
} from 'react-native';

import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';

const tick = require('../assets/images/QuestionTik.png');

const MultiSelectQuestion = ({options, selected = [], onSelect}:any) => {

return (

<View style={styles.container}>

{options.map((item:string,index:number)=>{

const isSelected = selected.includes(item);

return(

<TouchableOpacity
key={index}
style={[
styles.optionCard,
isSelected && styles.selected
]}
onPress={()=>onSelect(item)}
>

<View style={styles.row}>

<Text
style={[
styles.text,
isSelected && styles.textSelected
]}
>

{item}

</Text>

{isSelected && (

<Image
source={tick}
style={styles.tick}
/>

)}

</View>

</TouchableOpacity>

)

})}

</View>

)

}

export default MultiSelectQuestion

const styles = StyleSheet.create({

container:{
flexDirection:'row',
flexWrap:'wrap',
gap:10,
marginTop:10
},

optionCard:{
borderWidth:1,
borderColor:'#E5E7EB',
paddingVertical:12,
paddingHorizontal:16,
borderRadius:14,
backgroundColor:'#fff',
alignSelf:'flex-start'
},

selected:{
backgroundColor:Colors.questionGreen,
borderColor:Colors.questionGreen
},

row:{
flexDirection:'row',
alignItems:'center',
gap:6
},

text:{
fontSize:16,
fontFamily:Fonts.PoppinsMedium,
color:'#374151'
},

textSelected:{
color:'#fff'
},

tick:{
width:12,
height:12
}

});