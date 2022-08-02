import { useEffect, useState, useContext } from 'react';
import {
  Flex,
  SummaryList,
  SummaryListItem,
  ViewAll,
  ModalManagerContext,
  Modal,
  registerIcon,
  Icon,
  MetaList,
  MetaListProps
} from '@pega/cosmos-react-core';

import * as accessibleIcon from './icons/accessible.icon';
import * as busIcon from './icons/bus.icon';
import * as mbtaIcon from './icons/mbta.icon';
import * as subwayIcon from './icons/subway.icon';

registerIcon(accessibleIcon, busIcon, mbtaIcon, subwayIcon);

export interface MBTAListProps {}

const params = new URLSearchParams([
  ['page[offset]', '0'],
  ['page[limit]', '1000'],
  ['filter[latitude]', '42.362339984866466'],
  ['filter[longitude]', '-71.07999650212442'],
  ['filter[radius]', '0.01'],
  ['filter[route_type]', '1,3']
]);

const MBTAList = (props: MBTAListProps) => {
  const [items, setItems] = useState<SummaryListItem[]>();
  const [error, setError] = useState<string>();
  const { create } = useContext(ModalManagerContext);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api-v3.mbta.com/stops?${params}`, { signal: controller.signal })
      .then(async res => {
        if (!res.ok) throw new Error(`Responded with "${res.status}"`);

        const { data } = await res.json();
        if (controller.signal.aborted) return;

        setItems(
          // TODO: Type the api response: https://api-v3.mbta.com/docs/swagger/index.html#/Stop/ApiWeb_StopController_index
          data.map(({ id, attributes }: any) => {
            const meta: MetaListProps['items'] = [];

            if (attributes.wheelchair_boarding) {
              meta.push(
                <>
                  <Icon name='accessible' style={{ width: '1em', height: '1em' }} />
                  &nbsp;Wheelchair boarding
                </>
              );
            }

            if (attributes.vehicle_type === 1) {
              meta.push(attributes.platform_name);
              return {
                id,
                visual: <Icon name='subway' />,
                primary: attributes.name,
                secondary: <MetaList items={meta} />
              };
            }

            meta.push(attributes.name);
            return {
              id,
              visual: <Icon name='bus' />,
              primary: attributes.on_street,
              secondary: <MetaList items={meta} />
            };
          })
        );
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred.');
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SummaryList
      {...props}
      icon='mbta'
      name='Stops near Pega'
      count={items?.length}
      items={items?.slice(0, 3) ?? []}
      loading={!items && !error}
      error={error ? { message: error } : undefined}
      onViewAll={() => {
        create(Modal, {
          heading: (
            <Flex container={{ gap: 1, alignItems: 'center' }}>
              <Icon name='mbta' />
              Stops near Pega
            </Flex>
          ),
          count: items?.length,
          children: <ViewAll items={items ?? []} />
        });
      }}
    />
  );
};

export default MBTAList;
