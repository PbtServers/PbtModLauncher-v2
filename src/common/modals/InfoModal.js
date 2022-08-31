import React from 'react';
import Modal from '../components/Modal';

const InfoModal = ({ modName, error, preventClose }) => {
  return (
    <Modal
      css={`
        width: 50%;
        max-width: 550px;
        overflow-x: hidden;
      `}
      preventClose={preventClose}
      title="La Descarga de un Mod ha Fallado"
    >
      <div>
        El Mod ${modName || ''} no ha Podido Descargarse
        <div
          css={`
            background: ${props => props.theme.palette.grey[900]};
            padding: 10px;
            margin: 10px 0;
          `}
        >
          {'> '}
          {error.toString()}
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal;
