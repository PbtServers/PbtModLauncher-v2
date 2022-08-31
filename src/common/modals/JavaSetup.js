/* eslint-disable no-loop-func */
import React, { useState, useEffect, memo } from 'react';
import { Button, Progress, Input } from 'antd';
import { Transition } from 'react-transition-group';
import styled, { useTheme } from 'styled-components';
import { ipcRenderer } from 'electron';
import fse from 'fs-extra';
import { useSelector, useDispatch } from 'react-redux';
import path from 'path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { exec } from 'child_process';
import { promisify } from 'util';
import Modal from '../components/Modal';
import { downloadFile } from '../../app/desktop/utils/downloader';
import {
  convertOSToJavaFormat,
  extractAll,
  isLatestJavaDownloaded
} from '../../app/desktop/utils';
import { _getTempPath } from '../utils/selectors';
import { closeModal } from '../reducers/modals/actions';
import {
  updateJavaLatestPath,
  updateJavaPath
} from '../reducers/settings/actions';
import { UPDATE_MODAL } from '../reducers/modals/actionTypes';
import { LATEST_JAVA_VERSION } from '../utils/constants';

const JavaSetup = () => {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [isJava8Downloaded, setIsJava8Downloaded] = useState(null);
  const [isJavaLatestDownloaded, setIsJavaLatestDownloaded] = useState(null);
  const [java8Log, setJava8Log] = useState(null);
  const [javaLatestLog, setJavaLatestLog] = useState(null);
  const javaManifest = useSelector(state => state.app.javaManifest);
  const javaLatestManifest = useSelector(state => state.app.javaLatestManifest);
  const userData = useSelector(state => state.userData);
  const manifests = {
    javaLatest: javaLatestManifest,
    java: javaManifest
  };

  useEffect(() => {
    isLatestJavaDownloaded(manifests, userData, true, 8)
      .then(e => {
        setIsJava8Downloaded(e?.isValid);
        return setJava8Log(e?.log);
      })
      .catch(err => console.error(err));
    isLatestJavaDownloaded(manifests, userData, true, LATEST_JAVA_VERSION)
      .then(e => {
        setIsJavaLatestDownloaded(e?.isValid);
        return setJavaLatestLog(e?.log);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Modal
      title="Instalación de Java"
      css={`
        height: 380px;
        width: 600px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 20px;
        position: relative;
      `}
      header={false}
    >
      <Transition in={step === 0} timeout={200}>
        {state => (
          <FirstStep state={state}>
            <div
              css={`
                font-size: 28px;
                text-align: center;
                margin-bottom: 20px;
              `}
            >
              Instalación de Java
            </div>
            <div
              css={`
                margin-bottom: 20px;
                font-size: 18px;
                text-align: justify;
              `}
            >
              Recomendamos la Instalación Automática, pero si Sabes lo que Haces, Puedes utilizar el Modo Manual
            </div>

            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                margin-bottom: 40px;
                opacity: 0;
                opacity: ${isJava8Downloaded !== null &&
                isJavaLatestDownloaded !== null &&
                (!isJava8Downloaded || !isJavaLatestDownloaded) &&
                '1'};
                * > h3 {
                  border-radius: 5px;
                  padding: 2px 4px;
                  background: ${props => props.theme.palette.colors.red};
                }
              `}
            >
              <h3>Versiones Restantes:</h3>
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-right: 40px;
                  h3 {
                    width: 71px;
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    padding: 2px;
                    box-sizing: content-box;
                  }
                `}
              >
                {!isJava8Downloaded && isJava8Downloaded !== null && (
                  <h3
                    css={`
                      margin-right: 20px;
                    `}
                  >
                    Java 8
                  </h3>
                )}
                {!isJavaLatestDownloaded && isJavaLatestDownloaded !== null && (
                  <h3>Java {LATEST_JAVA_VERSION}</h3>
                )}
              </div>
            </div>

            <div
              css={`
                & > div {
                  display: flex;
                  justify-content: center;
                  margin-top: 20px;
                }
              `}
            >
              <div>
                <Button
                  type="primary"
                  css={`
                    width: 150px;
                  `}
                  onClick={() => {
                    setStep(1);
                    setChoice(0);
                  }}
                >
                  Automático
                </Button>
              </div>
              <div>
                <Button
                  type="text"
                  css={`
                    width: 150px;
                  `}
                  onClick={() => {
                    setStep(1);
                    setChoice(1);
                  }}
                >
                  Manual
                </Button>
              </div>
            </div>
          </FirstStep>
        )}
      </Transition>
      <Transition in={step === 1} timeout={200}>
        {state => (
          <SecondStep state={state}>
            <div
              css={`
                font-size: 28px;
                text-align: center;
                margin-bottom: 20px;
              `}
            >
              Instalación {choice === 0 ? 'Automática' : 'Manual'}
            </div>
            {choice === 0 ? (
              <AutomaticSetup
                isJava8Downloaded={isJava8Downloaded}
                isJavaLatestDownloaded={isJavaLatestDownloaded}
                java8Log={java8Log}
                javaLatestLog={javaLatestLog}
              />
            ) : (
              <ManualSetup setStep={setStep} />
            )}
          </SecondStep>
        )}
      </Transition>
    </Modal>
  );
};

const ManualSetup = ({ setStep }) => {
  const [javaPath, setJavaPath] = useState('');
  const [javaLatestPath, setJavaLatestPath] = useState('');
  const dispatch = useDispatch();

  const selectFolder = async version => {
    const { filePaths, canceled } = await ipcRenderer.invoke('openFileDialog');
    if (!canceled) {
      if (version === LATEST_JAVA_VERSION) {
        setJavaLatestPath(filePaths[0]);
      } else setJavaPath(filePaths[0]);
    }
  };
  return (
    <div
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={`
          margin-bottom: 50px;
          font-size: 18px;
        `}
      >
        Elige los Directorios a las Respectivas Versiones de Minecraft
      </div>

      <div
        css={`
          width: 100%;
          display: flex;
          margin-bottom: 10px;
        `}
      >
        <Input
          placeholder="Elige tu Ejecutable de Java8 (MC < 1.17)"
          onChange={e => setJavaPath(e.target.value)}
          value={javaPath}
        />
        <Button
          type="primary"
          onClick={() => selectFolder(8)}
          css={`
            margin-left: 10px;
          `}
        >
          <FontAwesomeIcon icon={faFolder} />
        </Button>
      </div>

      <div
        css={`
          width: 100%;
          display: flex;
        `}
      >
        <Input
          placeholder={`Elige tu Ejecutable de Java${LATEST_JAVA_VERSION} (MC >= 1.17)`}
          onChange={e => setJavaLatestPath(e.target.value)}
          value={javaLatestPath}
        />
        <Button
          type="primary"
          onClick={() => selectFolder(LATEST_JAVA_VERSION)}
          css={`
            margin-left: 10px;
          `}
        >
          <FontAwesomeIcon icon={faFolder} />
        </Button>
      </div>

      <div
        css={`
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 45px;
          position: absolute;
          bottom: 0;
        `}
      >
        <Button type="primary" onClick={() => setStep(0)}>
          Volver
        </Button>
        <Button
          type="danger"
          disabled={javaPath === '' || javaLatestPath === ''}
          onClick={() => {
            dispatch(updateJavaPath(javaPath));
            dispatch(updateJavaLatestPath(javaLatestPath));
            dispatch(closeModal());
          }}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

const AutomaticSetup = ({
  isJava8Downloaded,
  isJavaLatestDownloaded,
  java8Log,
  javaLatestLog
}) => {
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState('Descargando Java');
  const [currentStepPercentage, setCurrentStepPercentage] = useState(0);
  const javaManifest = useSelector(state => state.app.javaManifest);
  const javaLatestManifest = useSelector(state => state.app.javaLatestManifest);
  const userData = useSelector(state => state.userData);
  const tempFolder = useSelector(_getTempPath);
  const modals = useSelector(state => state.modals);
  const dispatch = useDispatch();

  const theme = useTheme();
  const javaToInstall = [];
  useEffect(() => {
    if (javaToInstall.length > 0) {
      const instanceManagerModalIndex = modals.findIndex(
        x => x.modalType === 'JavaSetup'
      );

      dispatch({
        type: UPDATE_MODAL,
        modals: [
          ...modals.slice(0, instanceManagerModalIndex),
          {
            modalType: 'JavaSetup',
            modalProps: { preventClose: true }
          },
          ...modals.slice(instanceManagerModalIndex + 1)
        ]
      });
    }
  }, []);

  if (!isJava8Downloaded) javaToInstall.push(8);

  if (!isJavaLatestDownloaded) javaToInstall.push(LATEST_JAVA_VERSION);

  const installJava = async () => {
    const javaOs = convertOSToJavaFormat(process.platform);
    const java8Meta = javaManifest.find(v => v.os === javaOs);
    const javaLatestMeta = javaLatestManifest.find(
      v =>
        v.os === javaOs &&
        v.architecture === 'x64' &&
        (v.binary_type === 'jre' || v.binary_type === 'jdk')
    );

    const totalExtractionSteps = process.platform !== 'win32' ? 2 : 1;
    const totalSteps = (totalExtractionSteps + 1) * javaToInstall.length;

    const setStepPercentage = (stepNumber, percentage) => {
      setCurrentStepPercentage(
        parseInt(percentage / totalSteps + (stepNumber * 100) / totalSteps, 10)
      );
    };

    let index = 0;
    for (const javaVersion of javaToInstall) {
      const {
        version_data: { openjdk_version: version },
        binary_link: url
      } = javaVersion === 8 ? java8Meta : javaLatestMeta;
      const javaBaseFolder = path.join(userData, 'java');

      await fse.remove(path.join(javaBaseFolder, version));
      const downloadLocation = path.join(tempFolder, path.basename(url));

      setCurrentSubStep(`Java ${javaVersion} - Descargando`);
      await downloadFile(downloadLocation, url, p => {
        ipcRenderer.invoke('update-progress-bar', p);
        setDownloadPercentage(p);
        setStepPercentage(index, p);
      });

      ipcRenderer.invoke('update-progress-bar', -1);
      index += 1;
      setDownloadPercentage(0);
      setStepPercentage(index, 0);
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentSubStep(
        `Java ${javaVersion} - Extracción 1 / ${totalExtractionSteps}`
      );
      let { extractedParentDir } = await extractAll(
        downloadLocation,
        tempFolder,
        {
          $progress: true
        },
        {
          update: percent => {
            ipcRenderer.invoke('update-progress-bar', percent);
            setDownloadPercentage(percent);
            setStepPercentage(index, percent);
          }
        }
      );

      index += 1;
      setDownloadPercentage(0);
      setStepPercentage(index, 0);

      await fse.remove(downloadLocation);

      // If NOT windows then tar.gz instead of zip, so we need to extract 2 times.
      if (process.platform !== 'win32') {
        ipcRenderer.invoke('update-progress-bar', -1);
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentSubStep(
          `Java ${javaVersion} - Extracting 2 / ${totalExtractionSteps}`
        );

        const tempTarName = path.join(
          tempFolder,
          path.basename(url).replace('.tar.gz', '.tar')
        );

        ({ extractedParentDir } = await extractAll(
          tempTarName,
          tempFolder,
          {
            $progress: true
          },
          {
            update: percent => {
              ipcRenderer.invoke('update-progress-bar', percent);
              setDownloadPercentage(percent);
              setStepPercentage(index, percent);
            }
          }
        ));
        await fse.remove(tempTarName);
        index += 1;
        setDownloadPercentage(0);
        setStepPercentage(index, 0);
      }

      const directoryToMove =
        process.platform === 'darwin'
          ? path.join(tempFolder, extractedParentDir, 'Contents', 'Home')
          : path.join(tempFolder, extractedParentDir);
      await fse.move(directoryToMove, path.join(javaBaseFolder, version));

      await fse.remove(path.join(tempFolder, extractedParentDir));

      const ext = process.platform === 'win32' ? '.exe' : '';

      if (process.platform !== 'win32') {
        const execPath = path.join(
          javaBaseFolder,
          version,
          'bin',
          `java${ext}`
        );

        await promisify(exec)(`chmod +x "${execPath}"`);
        await promisify(exec)(`chmod 755 "${execPath}"`);
      }
    }

    dispatch(updateJavaPath(null));
    dispatch(updateJavaLatestPath(null));
    setCurrentSubStep(`Listo para Jugar!`);
    ipcRenderer.invoke('update-progress-bar', -1);
    setDownloadPercentage(100);
    setCurrentStepPercentage(100);
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!javaLatestLog || !java8Log) dispatch(closeModal());
  };

  useEffect(() => {
    installJava();
  }, []);

  return (
    <div
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      {javaToInstall.length > 0 ? (
        <>
          <div
            css={`
              margin-top: -15px; //cheaty way to get up to the Modal title :P
              margin-bottom: 50px;
              width: 50%;
            `}
          >
            <Progress
              percent={currentStepPercentage}
              strokeColor={theme.palette.primary.main}
              status="normal"
            />
          </div>
          <div
            css={`
              margin-bottom: 20px;
              font-size: 18px;
            `}
          >
            {currentSubStep}
          </div>
          <div
            css={`
              padding: 0 10px;
              width: 100%;
            `}
          >
            {downloadPercentage ? (
              <Progress
                percent={downloadPercentage}
                strokeColor={theme.palette.primary.main}
                status="normal"
              />
            ) : null}
          </div>
        </>
      ) : (
        <div
          css={`
            display: flex;
            flex-direction: column;
            div {
              display: flex;
              flex-direction: column;
            }
          `}
        >
          <h2>Java is already installed!</h2>
          <div
            css={`
              margin-bottom: 10px;
            `}
          >
            <h3>Java 8 details:</h3>
            <code>{java8Log}</code>
          </div>
          <div>
            <h3>Java {LATEST_JAVA_VERSION} details:</h3>
            <code>{javaLatestLog}</code>
          </div>
        </div>
      )}
      {javaLatestLog && java8Log && (
        <Button
          css={`
            position: absolute;
            bottom: 0;
            right: 0;
          `}
          type="primary"
          onClick={() => dispatch(closeModal())}
        >
          Close
        </Button>
      )}
    </div>
  );
};

export default memo(JavaSetup);

const FirstStep = styled.div`
  transition: 0.2s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  transform: translateX(
    ${({ state }) => (state === 'exiting' || state === 'exited' ? -100 : 0)}%
  );
`;

const SecondStep = styled.div`
  transition: 0.2s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  transform: translateX(
    ${({ state }) => (state === 'entering' || state === 'entered' ? 0 : 101)}%
  );
`;
