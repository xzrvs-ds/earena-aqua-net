import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';

type StatusBadgeProps = {
  online: boolean;
  className?: string;
};

export const StatusBadge = ({ online, className }: StatusBadgeProps) => {
  const { t } = useTranslation();

  return (
    <Badge
      variant={online ? 'default' : 'secondary'}
      className={`relative ${className}`}
    >
      <motion.span
        className="mr-1 inline-block h-2 w-2 rounded-full"
        style={{
          backgroundColor: online ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))',
        }}
        animate={online ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {online ? t('device.online') : t('device.offline')}
    </Badge>
  );
};
