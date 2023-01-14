import React from 'react';
import { PromoteIcon } from '../../Icons/Promote';
import { RetryIcon } from '../../Icons/Retry';
import { TrashIcon } from '../../Icons/Trash';
import { Tooltip } from '../../Tooltip/Tooltip';
import { Button } from '../Button/Button';
import s from './JobActions.module.css';
import { Status } from '@bull-board/api/typings/app';
import { STATUSES } from '@bull-board/api/src/constants/statuses';
import classNames from 'classnames/bind';
import { useSettingsStore } from '../../../hooks/useSettings';

const cx = classNames.bind(s);

interface JobActionsProps {
  status: Status;
  allowRetries: boolean;
  actions: {
    promoteJob: () => Promise<void>;
    retryJob: () => Promise<void>;
    cleanJob: () => Promise<void>;
  };
}

interface ButtonType {
  title: string;
  Icon: React.ElementType;
  actionKey: 'promoteJob' | 'cleanJob' | 'retryJob';
}

const buttonTypes: Record<string, ButtonType> = {
  promote: { title: 'Promote', Icon: PromoteIcon, actionKey: 'promoteJob' },
  clean: { title: 'Clean', Icon: TrashIcon, actionKey: 'cleanJob' },
  retry: { title: 'Retry', Icon: RetryIcon, actionKey: 'retryJob' },
};

const statusToButtonsMap: Record<string, ButtonType[]> = {
  [STATUSES.failed]: [buttonTypes.retry, buttonTypes.clean],
  [STATUSES.delayed]: [buttonTypes.promote, buttonTypes.clean],
  [STATUSES.completed]: [buttonTypes.retry, buttonTypes.clean],
  [STATUSES.waiting]: [buttonTypes.clean],
};

export const JobActions = ({ actions, status, allowRetries }: JobActionsProps) => {
  const { darkMode } = useSettingsStore();
  let buttons = statusToButtonsMap[status];
  if (!buttons) {
    return null;
  }

  if (!allowRetries) {
    buttons = buttons.filter((btn) => btn.actionKey !== 'retryJob');
  }

  return (
    <ul className={cx(s.jobActions, {dark: darkMode})}>
      {buttons.map((type) => (
        <li key={type.title}>
          <Tooltip title={type.title}>
            <Button theme="basicDark" onClick={actions[type.actionKey]} className={cx(s.button)}>
              <type.Icon />
            </Button>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
};
