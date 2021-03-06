import React, { Component } from 'react';
import styled from 'styled-components';

import HeaderArtwork from '../Landing/HeaderArtwork';
import _GlowingButton from '../Core/GlowingButton';
import { TextInput } from '../Form/TextInput';
import colors from '../../utils/colors';
import api from '../../utils/api';

const TextContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${colors.cyan};
  font-size: 62px;
  line-height: 58px;
  text-transform: uppercase;
  font-weight: 600;
  padding: 7px 0px;
  text-algin: text-center;
  @media(max-width: 768px) {
    font-size: 38px;
    padding-top: 18px;
    line-height: 38px;
  }
`;

const UploadZone = styled.div`
  text-align: center;
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
    @media(max-width: 768px) {
      max-width: 100%;
    }
  }
`;

const UploadButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 200px;
`;

const Input = styled.input.attrs({
  type: 'file',
  accept: 'image/*',
})`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  cursor: pointer;
`;

const GlowingButton = styled(_GlowingButton)`
  text-align: center;
  margin: 0 auto;
  font-size: 20px;
  padding: 12px 0 6px;
`;

const SubmitButton = styled(_GlowingButton)`
  width: 200px;
  margin: 0 auto;
  margin-top: 15px;
  font-size: 20px;
  padding: 12px 0 6px;
`;

const Subtitle = styled.h2`
  text-align: center;
  font-size: 28px;
  line-height: 32px;
  color: ${colors.white};
  margin-bottom: 20px;
  
  @media(max-width: 768px) {
    font-size: 22px;
  }
`;

export default class SlipUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      image: null,
      doneUpload: false,
      name: '',
      amount: '',
      date: ''
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleSubmitFile = this.handleSubmitFile.bind(this);
  }
  getImage(img) { // eslint-disable-line
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const context = tempCanvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);
    return tempCanvas.toDataURL();
  }
  handleUploadFile(event) {
    const files = event.target.files;
    if (!files) {
      return;
    }
    const file = files[0];
    this.setState({ file });
    const reader = new FileReader(); // eslint-disable-line
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image(); // eslint-disable-line
      img.src = e.target.result;
      img.onload = () => {
        this.setState({ image: this.getImage(img) });
      };
    };
  }
  handleSubmitFile(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('slip', this.state.file);
    data.append('name', this.state.name);
    data.append('transfer_money', this.state.amount);
    data.append('transfer_at', this.state.date);
    api.post('/finalists/slip', data)
      .then(() => this.setState({ doneUpload: true }));
  }
  render() {
    const { image, file, doneUpload, name, amount, date } = this.state;
    return (
      <div id="upload-slip">
        <TextContainer>
          <HeaderArtwork />
          <Title>Upload Slip</Title>
        </TextContainer>
        <Subtitle>อัพโหลดหลักฐานการโอนเงิน</Subtitle>        
        {!doneUpload && (
          <UploadZone>
            {image && <img src={image} alt="slip" />}
            <UploadButtonWrapper>
              <GlowingButton>อัพโหลดไฟล์สลิป</GlowingButton>
              <Input onChange={this.handleUploadFile} />
            </UploadButtonWrapper>
            {file && (
              <div>
                <TextInput value={name} setField={(_, v) => this.setState({ name: v })} label="ชื่อ-นามสกุล" />
                <TextInput value={amount} setField={(_, v) => this.setState({ amount: v })} label="จำนวนเงินที่โอน" />
                <TextInput value={date} setField={(_, v) => this.setState({ date: v })} label="วัน/เวลาที่โอนโดยประมาณ" />
                <SubmitButton
                  onClick={name && amount ? this.handleSubmitFile : null}
                >ส่งไฟล์สลิป</SubmitButton>
              </div>
            )}
          </UploadZone>
        )}
        {doneUpload && <Subtitle>ทางทีมงานจะติดต่อกลับเพื่อยืนยันการโอนเงินภายในวันที่ 7 ธันวาคม หากยังไม่ได้รับการติดต่อจากทีมงานในวันดังกล่าวสามารถแจ้งได้ทาง <a href="https://www.facebook.com/ywcth/" target="_blank" rel="noopener noreferrer">Inbox เพจเฟสบุ๊ค</a></Subtitle>}
      </div>
    );
  }
}
