export const Encryption = (data: any) => {
  const crypted_text = Buffer.from(data).toString('base64');

  return crypted_text;
}
