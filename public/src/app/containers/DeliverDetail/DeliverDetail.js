import React, {
  Component
} from 'react';

import {
  bindActionCreators
} from 'redux';

import QRious from 'qrious';

import moment from 'moment';

import {
  showToast
} from '../../actions/Popups';

import {
  fetchDeliverDetail
} from '../../actions/HTTP';

import {
  connect
} from 'react-redux';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import purerender from '../../decorators/purerender';

import styles from './DeliverDetail.scss';

import qrIcon from './qr.png';
import doneIcon from './done.png';
import Modal from 'react-bootstrap/lib/Modal';

@connect(state => ({
	deliverdetail: state.get('deliverdetail'),
	user: state.get('user')
}), dispatch => bindActionCreators({
	fetchDeliverDetail: fetchDeliverDetail.bind(this, dispatch),
}, dispatch))

export default class DeliverDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalShow: false,
      qrShow: false
    };
  }

  componentWillMount(){
    const {
      fetchDeliverDetail,
      showToast,
      params
    } = this.props;

    fetchDeliverDetail(params.id);
  }


  showQR = userId => {

    this.setState({
      qrImg: new QRious({
        size: 260,
        value: 'http://www.yunlaiwu.com/mobile/transfer?add=' + encodeURIComponent('yunlaiwu://www.yunlaiwu.com/chat?user=' + userId),
        foreground: '#000'
      }).toDataURL('image/jpeg'),
      qrShow: true
    });
  }

  closeQR = () => {
    this.setState({
      qrShow: false
    });
  }


  render(){
    const self = this;
    const {
      modalShow,
      qrShow,
      qrImg
    } = this.state;

    const {
      deliverdetail,
      user
    } = this.props;
    const ifRender = deliverdetail && deliverdetail.get('loadingState') == 'success';

    return (
        <div className={ styles.container }>
          { ifRender ?
            <div>
            { deliverdetail.get('status') == 0 &&
              <div className={ styles.label }>
                <div className={ styles.status }>初审中</div>
                <div className={ styles.lastDays }>剩余{deliverdetail.get('publishTime').split('：')[1]}</div>
              </div>
            }

            { deliverdetail.get('status') == 1 &&
              <div className={ styles.label }>
                <div className={ styles.status }>复审中</div>
                <div className={ styles.lastDays }>剩余{deliverdetail.get('publishTime').split('：')[1]}</div>
              </div>
            }

            { deliverdetail.get('status') == 2 &&
              <div className={ styles.label + ' ' + styles.fail }>
                <div className={ styles.status2 }>不合适</div>
              </div>
            }

            { deliverdetail.get('status') == 3 &&
              <div className={ styles.label + ' ' + styles.succ }>
                <div className={ styles.status2 }>已采纳</div>
              </div>
            }

            <div className={ styles.title }>投稿进度</div>
            <div className={ styles.desc }>{ deliverdetail.get('title') }</div>
            <a className={ styles.jumpChunk } target="_blank" href={ "http://www.yunlaiwu.com/collect/detail/" + deliverdetail.get('callId') }>
              <div className={ styles.infos }>征集需求：{deliverdetail.get('publishDemand')}</div>
              <div className={ styles.infos }>发布人：{deliverdetail.get('publishName')}</div>
            </a>
            {
              deliverdetail.get('status') == 2 &&
              <div className={ styles.infos }>不合适：{deliverdetail.get('reason') ? deliverdetail.get('reason') : '作品不合适，已被退稿'}</div>
            }
            <div className={ styles.horizontalLine }></div>

            {
              deliverdetail.get('status') == 0 &&
              <div className={ styles.stepCont }>
              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>成功投递作品《{deliverdetail.get('title')}》</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('submitTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark }>2</div>
                <div className={ styles.stepTitle }>初审中</div>
                <div className={ styles.stepDate }>截至{moment(deliverdetail.get('callEnd')*1000 + 10 * 3600 * 24 * 1000 ).format('YYYY.MM.DD')}，剩余{Math.ceil(((deliverdetail.get('callEnd')*1000 + 10 * 3600 * 24 * 1000) - (new Date().valueOf())) / (24 * 3600 * 1000))}天</div>
                <div className={ styles.stepDesc }>
                  非常感谢您的投递，还请耐心等待，征稿人在{Math.ceil(((deliverdetail.get('callEnd')*1000 + 10 * 3600 * 24 * 1000) - (new Date().valueOf())) / (24 * 3600 * 1000))}天内决定您的投稿作品是否进入复审
                </div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine + ' ' + styles.big + ' ' + styles.gray }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.gray }>3</div>
                <div className={ styles.stepTitle }>复审</div>
                <div className={ styles.stepDate }>截至{moment(deliverdetail.get('callEnd')*1000 + 17 * 3600 * 24 * 1000).format('YYYY.MM.DD')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine + ' ' + styles.gray }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.gray }>4</div>
                <div className={ styles.stepTitle }>被采纳，交易阶段</div>
                <div className={ styles.clearfix }></div>
              </div>
            </div>
            }
            
            {
              deliverdetail.get('status') == 1 &&
              <div className={ styles.stepCont }>
              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>成功投递作品《{deliverdetail.get('title')}》</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('submitTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>初审通过时间</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('reviewTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark }>3</div>
                <div className={ styles.stepTitle }>复审中</div>
                <div className={ styles.stepDate }>截至{moment(deliverdetail.get('callEnd')*1000 + 17 * 3600 * 24 * 1000).format('YYYY.MM.DD')}，剩余{ Math.ceil(((deliverdetail.get('callEnd')*1000 + 17*3600 * 24 * 1000) - (new Date().valueOf())) / (24 * 3600 * 1000)) }天</div>
                <div className={ styles.stepDesc }>
                  恭喜您的投稿进入复审阶段，征稿人会在{ Math.ceil(((deliverdetail.get('callEnd')*1000 + 17*3600 * 24 * 1000) - (new Date().valueOf())) / (24 * 3600 * 1000)) }天内决定是否采纳您的作品
                </div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine + ' ' + styles.gray + ' ' + styles.big }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark  + ' ' + styles.gray }>4</div>
                <div className={ styles.stepTitle }>被采纳，交易阶段</div>
                <div className={ styles.clearfix }></div>
              </div>
            </div>
            }

            {
              deliverdetail.get('status') == 2 &&
              <div className={ styles.stepCont + ' ' + styles.gray }>
              <div className={ styles.step }>
                <div className={ styles.stepMark }></div>
                <div className={ styles.stepTitle }>成功投递作品《{deliverdetail.get('title')}》</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('submitTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark }></div>
                <div className={ styles.stepTitle }>初审</div>
                <div className={ styles.stepDate }>截至{moment(deliverdetail.get('callEnd')*1000 + 10 * 3600 * 24 * 1000 ).format('YYYY.MM.DD')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark }></div>
                <div className={ styles.stepTitle }>复审</div>
                <div className={ styles.stepDate }>截至{moment(deliverdetail.get('callEnd')*1000 + 17 * 3600 * 24 * 1000).format('YYYY.MM.DD')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark }></div>
                <div className={ styles.stepTitle }>被采纳，交易阶段</div>
                <div className={ styles.clearfix }></div>
              </div>
              <a className={ styles.scan } href="http://www.yunlaiwu.com/collect/list" target="_blank">看看其他征稿</a>
            </div>
            }

            {
              deliverdetail.get('status') == 3 &&
              <div className={ styles.stepCont }>
              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>成功投递作品《{deliverdetail.get('title')}》</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('submitTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>初审通过时间</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('reviewTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>复审通过时间</div>
                <div className={ styles.stepDate }>{moment(deliverdetail.get('adoptTime')*1000).format('YYYY.MM.DD HH:mm:ss')}</div>
                <div className={ styles.clearfix }></div>
              </div>

              <div className={ styles.stepLine }></div>

              <div className={ styles.step }>
                <div className={ styles.stepMark + ' ' + styles.done }><img width="32" height="32" src={ doneIcon }/></div>
                <div className={ styles.stepTitle }>被采纳，交易阶段</div>
                <div className={ styles.stepDate }>{deliverdetail.get('publishTime').split('：')[1]}</div>
                <div className={ styles.stepDesc }>
                  恭喜您的作品被征稿人采纳，您可以直接联系对方。如对方已报价可在［我］－［我的订单］查看并处理报价
                </div>
                <div className={ styles.clearfix }></div>
              </div>
              <div className={ styles.scan } onClick={ this.showQR.bind(this, deliverdetail.get('publisher')) }><img src={ qrIcon } />联系征稿方</div>
            </div>
            }

          </div>
            :
            null
          }
          <Modal show={ qrShow } className={ styles.modal } onHide={ this.closeQR }>
          <Modal.Header closeButton>
            <Modal.Title>联系征稿方</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={ qrImg } />
            <p>请使用云莱坞App扫描此二维码联系征稿方</p>
            <p>还没有云莱坞APP？手机扫一扫此二维码下载</p>
          </Modal.Body>
        </Modal>
        </div>
    );

  }

}
