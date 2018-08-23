import React from 'react';
 
export default class Ueditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentDidMount(){
    this.initEditor()
  }
  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor(this.props.id);
  }
  initEditor() {
    const id = this.props.id;
    const ueEditor = UE.getEditor(this.props.id);
    const self = this;
    
    ueEditor.ready((ueditor) => {
      
      if (!ueditor) {
        UE.delEditor(id);
        self.initEditor();
      }
    })
  }

  render(){
    console.log(this.props)

    return (
      <div id={this.props.id} name="content" type="text/plain"></div>
    )
  }
}

