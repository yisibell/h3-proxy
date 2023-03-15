import { EventHandler } from 'h3';
import { IncomingMessage } from 'http';

type CustomPathFilter = (
  pathname: string,
  req: IncomingMessage
) => boolean

type PathFilterParams = string | string[] | CustomPathFilter

interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
}

type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler

declare const createProxyEventHandler: CreateProxyEventHandler

export { createProxyEventHandler };
