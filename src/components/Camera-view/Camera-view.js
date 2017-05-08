import React, {Component} from 'react'
import {Text, StyleSheet, Button} from 'react-native'
import {connect} from 'react-redux'
import Nav from '../Nav'
import ImagePicker from 'react-native-image-crop-picker'
import { Buffer } from 'buffer'
import axios from 'axios'

class Camera extends Component{
	// eslint-disable-next-line 
	state = { 
		loading: ''
	}

	sendImage(image){
		this.setState({loading: 'LOADING'})
		const buf = new Buffer(image.data, 'base64')
		const fileName = this.props.profile.id + '_' + Date.now() + '.jpeg'
		const url = 'https://guarded-inlet-23236.herokuapp.com/sign-s3?file-name=' + fileName
		axios.get(url).then((response) => {
      axios({
        method: 'put',
        url: response.data.signedURL,
        data: buf,
        headers: {'Content-Type': 'image/jpeg'}
      }).then(() => {
        let url = 'https://s3-us-west-2.amazonaws.com/practice-s3-alex/' + fileName
      	axios.post('http://guarded-inlet-23236.herokuapp.com/saveUrl', {url}).then(()=>{
      		this.setState({loading: ''})
      		this.props.history.push('/Home')
      	})
    	})
    })
	}

	openPicker(){
		ImagePicker.openPicker({
		  width: 500,
		  height: 500,
		  cropping: true,
		  includeBase64: true,
		  hideBottomControls : true
		}).then(image => {
			this.sendImage.call(this, image)
		}).catch(() => null)
	}

	openCamera(){
		ImagePicker.openCamera({})
		.then(image => {
			ImagePicker.openCropper({
			  path: image.path,
			  width: 500,
			  height: 500,
			  includeBase64: true,
			  hideBottomControls : true
			}).then(image => {
				this.sendImage.call(this, image)
			}).catch(() => null)
		}).catch(() => null)
	}

	render(){
		return(
			<Nav>
				<Text>Camera Route</Text>
				<Button title="Camera" onPress={this.openCamera.bind(this)} />				
				<Button title="Gallery" onPress={this.openPicker.bind(this)} />
				<Text>{this.state.loading}</Text>				
			</Nav>
		)
	}
}

const styles = StyleSheet.create({
	
})

export default connect( state=>({ 
	profile: state.profileReducer.profile
}), {
	// Imported Actions
})(Camera)