import React, { useState } from 'react';
import fse from 'fs-extra';
import path from 'path';
import { Button } from 'antd';
import { useInterval } from 'rooks';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../components/Modal';
import { _getInstancesPath, _getInstances } from '../utils/selectors';
import { closeModal } from '../reducers/modals/actions';

const InstanceDeleteConfirmation = ({ instanceName }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const instancesPath = useSelector(_getInstancesPath);
  const instances = useSelector(_getInstances);

  const { start, stop } = useInterval(() => {
    if (!instances.find(instance => instance.name === instanceName)) {
      stop();
      dispatch(closeModal());
    }
  }, 200);

  const deleteInstance = async () => {
    setLoading(true);
    start();
    fse.remove(path.join(instancesPath, instanceName));
  };
  const closeModalWindow = () => dispatch(closeModal());
  return (
    <Modal
      css={`
        height: 40%;
        width: 50%;
        max-width: 550px;
        max-height: 260px;
        overflow-x: hidden;
      `}
      title="Confirmar Eliminación de Instancia"
    >
      <div>
        Seguro que Quieres Eliminar:
        <h4
          css={`
            font-style: italic;
            font-weight: 700;
            color: ${props => props.theme.palette.error.main};
          `}
        >
          {instanceName}
        </h4>
        Esta Acción es Permanente y se van a Perder todos los Datos
        <div
          css={`
            margin-top: 50px;
            display: flex;
            width: 100%;
            justify-content: space-between;
          `}
        >
          <Button
            onClick={closeModalWindow}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            No, Cancelar
          </Button>
          <Button onClick={deleteInstance} loading={loading}>
            Si, Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InstanceDeleteConfirmation;
