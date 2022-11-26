/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltRight,
  faArchive,
  faFileImport,
  faFileExport
} from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Radio } from 'antd';
import CurseForgeModpacks from './CurseForgeModpacks';
import FTBModpacks from './FTBModpacks';
import Import from './Import';
import Export from './CurseForge';
import minecraftIcon from '../../assets/minecraftIcon.png';
import curseForgeIcon from '../../assets/curseforgeIcon.webp';
import ftbIcon from '../../assets/ftbIcon.webp';

const Content = ({
  in: inProp,
  setStep,
  page,
  setPage,
  setVersion,
  version,
  setModpack,
  importZipPath,
  setImportZipPath,
  instanceName
}) => {
  const [overrideNextStepOnClick, setOverrideNextStepOnClick] = useState(null);
  const [loading, setLoading] = useState(false);

  let pages = [
    <Import
      setVersion={setVersion}
      setModpack={setModpack}
      instanceName={instanceName}
      importZipPath={importZipPath}
      setImportZipPath={setImportZipPath}
      setOverrideNextStepOnClick={setOverrideNextStepOnClick}
    />,
    <Export
      setVersion={setVersion}
      setModpack={setModpack}
      instanceName={instanceName}
      importZipPath={importZipPath}
      setImportZipPath={setImportZipPath}
      setOverrideNextStepOnClick={setOverrideNextStepOnClick}
    />
  ];

  return (
    <Transition in={inProp} timeout={200}>
      {state => (
        <Animation state={state}>
          <div
            css={`
              width: 100%;
              height: calc(100% - 40px);
              display: flex;
              margin: 20px;
            `}
          >
            <div
              css={`
                flex: 5;
                height: 100%;
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-content: center;
                  margin-bottom: 20px;
                `}
              >
                <Radio.Group
                  defaultValue={page}
                  onChange={e => setPage(e.target.value)}
                >
                  <Radio.Button value={0}>
                    <FontAwesomeIcon
                      icon={faFileImport}
                      css={`
                        margin-right: 4px;
                        cursor: pointer;
                      `}
                    />
                    Importar Mods
                  </Radio.Button>
                  <Radio.Button value={1}>
                    <FontAwesomeIcon
                      icon={faFileExport}
                      css={`
                        margin-right: 4px;
                        cursor: pointer;
                      `}
                    />
                    Exportar Mods
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div
                css={`
                  height: calc(100% - 50px);
                `}
              >
                {pages[page]}
              </div>
            </div>
            <div
              page={page}
              css={`
                position: absolute;
                bottom: 20px;
                right: 20px;
                opacity: ${props =>
                  props.page === 0 || props.page === 2 ? 1 : 0};
              `}
            >
              <div
                version={version}
                importZipPath={importZipPath}
                instanceName={instanceName}
                css={`
                  width: 70px;
                  height: 40px;
                  transition: 0.1s ease-in-out;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 4px;
                  font-size: 40px;
                  color: ${props =>
                    props.version || props.importZipPath
                      ? props.theme.palette.text.icon
                      : props.theme.palette.text.disabled};
                  ${props =>
                    props.version || props.importZipPath
                      ? 'cursor: pointer;'
                      : ''}
                  &:hover {
                    background-color: ${props =>
                      props.version || props.importZipPath
                        ? props.theme.action.hover
                        : 'transparent'};
                  }
                `}
                onClick={async () => {
                  if (overrideNextStepOnClick) {
                    setLoading(true);
                    try {
                      await overrideNextStepOnClick();
                    } catch {
                      return;
                    } finally {
                      setLoading(false);
                    }
                  }
                  if (version || importZipPath) {
                    setStep(1);
                  }
                }}
              >
                {loading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                ) : (
                  <FontAwesomeIcon icon={faLongArrowAltRight} />
                )}
              </div>
            </div>
          </div>
        </Animation>
      )}
    </Transition>
  );
};

export default Content;

const Animation = styled.div`
  transition: 0.2s ease-in-out;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  transform: translateX(
    ${({ state }) => (state === 'exiting' || state === 'exited' ? -100 : 0)}%
  );
`;
