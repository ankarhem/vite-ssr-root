import { ErrorResponse } from "@remix-run/router";
import { useRouteError } from "react-router-dom";

const statusCodeMap = {
  400: "Bad Request",
  401: "You aren't authorized to see this",
  404: "Page Not Found",
  418: "🫖",
  500: "Internal Server Error",
  503: "Looks like our API is down",
};

const CustomError = ({
  statusCode,
}: {
  statusCode: keyof typeof statusCodeMap;
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl">{statusCode}</h1>
        <span className="divider divider-horizontal"></span>
        <h2>{statusCodeMap[statusCode]}</h2>
      </div>
    </div>
  );
};

export const BadRequest = () => <CustomError statusCode={400} />;
export const Unauthorized = () => <CustomError statusCode={401} />;
export const NotFound = () => <CustomError statusCode={404} />;
export const ImATeaPot = () => <CustomError statusCode={418} />;
export const ServerError = () => <CustomError statusCode={500} />;
export const ServiceUnavailable = () => <CustomError statusCode={503} />;

export const RootBoundary = () => {
  const error = useRouteError() as any;

  if (typeof error?.status === "number") {
    switch (error.status) {
      case 400:
        return <BadRequest />;
      case 401:
        return <Unauthorized />;
      case 404:
        return <NotFound />;
      case 418:
        return <ImATeaPot />;
      case 500:
        return <ServerError />;
      case 503:
        return <ServiceUnavailable />;
      default:
        return <ServerError />;
    }
  }

  return <ServerError />;
};

interface ErrorProps {
  data: any;
}

export const badRequest = (props?: ErrorProps) => {
  const statusCode = 400;
  return new ErrorResponse(statusCode, statusCodeMap[statusCode], props?.data);
};

export const notFound = (props?: ErrorProps) => {
  const statusCode = 404;
  return new ErrorResponse(statusCode, statusCodeMap[statusCode], props?.data);
};

export const imATeaPot = (props?: ErrorProps) => {
  const statusCode = 418;
  return new ErrorResponse(statusCode, statusCodeMap[statusCode], props?.data);
};

export const serverError = (props?: ErrorProps) => {
  const statusCode = 500;
  return new ErrorResponse(statusCode, statusCodeMap[statusCode], props?.data);
};

export const serviceUnavailable = (props?: ErrorProps) => {
  const statusCode = 503;
  return new ErrorResponse(statusCode, statusCodeMap[statusCode], props?.data);
};
