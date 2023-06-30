import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../Card/Card';
import { Details } from './Details/Details';
import { JobActions } from './JobActions/JobActions';
import s from './JobCard.module.css';
import { Progress } from './Progress/Progress';
import { Timeline } from './Timeline/Timeline';
import { AppJob, Status } from '@bull-board/api/typings/app';
import { STATUSES } from '@bull-board/api/dist/src/constants/statuses';

interface JobCardProps {
  job: AppJob;
  jobUrlPath?: string;
  status: Status;
  readOnlyMode: boolean;
  allowRetries: boolean;
  actions: {
    promoteJob: () => Promise<void>;
    retryJob: () => Promise<void>;
    cleanJob: () => Promise<void>;
    getJobLogs: () => Promise<string[]>;
  };
}

const greenStatuses = [STATUSES.active, STATUSES.completed];

export const JobCard = ({
  job,
  status,
  actions,
  readOnlyMode,
  allowRetries,
  jobUrlPath,
}: JobCardProps) => (
  <Card className={s.card}>
    <div className={s.sideInfo}>
      {jobUrlPath ? (
        <NavLink to={jobUrlPath}>
          <span title={`#${job.id}`}>#{job.id}</span>
        </NavLink>
      ) : (
        <span title={`#${job.id}`}>#{job.id}</span>
      )}
      <Timeline job={job} status={status} />
    </div>
    <div className={s.contentWrapper}>
      <div className={s.title}>
        <h4>
          {job.name}
          {job.attempts > 1 && <span>attempt #{job.attempts}</span>}
          {!!job.opts?.repeat?.count && (
            <span>
              repeat {job.opts?.repeat?.count}
              {!!job.opts?.repeat?.limit && ` / ${job.opts?.repeat?.limit}`}
            </span>
          )}
        </h4>
        {!readOnlyMode && (
          <JobActions status={status} actions={actions} allowRetries={allowRetries} />
        )}
      </div>
      <div className={s.content}>
        <Details status={status} job={job} actions={actions} />
        {typeof job.progress === 'number' && (
          <Progress
            percentage={job.progress}
            status={
              job.isFailed && !greenStatuses.includes(status as any) ? STATUSES.failed : status
            }
            className={s.progress}
          />
        )}
      </div>
    </div>
  </Card>
);
