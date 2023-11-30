import React, { memo } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';

const AutoUpdatesNotAvailable = () => {
  return (
    <Modal
      css={`
        height: 200px;
        width: 400px;
      `}
      title="Actualizaciones no Disponibles"
    >
      <Container>
        <div>Las actualizaciones automáticas no están disponibles en esta plataforma.</div>
        <div
          css={`
            margin-top: 20px;
          `}
        >
          Porfavor, actualiza PbtModLauncher-v2 desde nuestro sitio web en github.
          la nueva versión está disponible <a href="https://mods.pbtservers.com">aquí</a>
        </div>
      </Container>
    </Modal>
  );
};

export default memo(AutoUpdatesNotAvailable);

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  color: ${props => props.theme.palette.text.primary};
`;
